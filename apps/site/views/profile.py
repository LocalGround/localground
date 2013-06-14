#!/usr/bin/env python
from django.http import Http404, HttpResponse
from localground.apps.site.lib.helpers import prep_paginator, QueryParser
from django.template import TemplateDoesNotExist, RequestContext
from django.shortcuts import render_to_response
from localground.apps.site.decorators import process_project
from django.contrib.auth.decorators import login_required 
from django.db.models.loading import get_model
from datetime import datetime
from localground.apps.site.models import Base, Project
import json

@login_required()
def change_user_profile(request, template_name='account/user_prefs.html'):
    """
    Works in conjunction with CustomUserChangeForm, UserProfileForm to allow
    user to modify his/her preferences.
    """
    from localground.apps.site.models import UserProfile
    from django.contrib.auth.models import User
    from localground.apps.site.forms import CustomUserChangeForm, UserProfileForm #, MapGroupForm
    page_num = 1
    user_form, user_profile_form = None, None
    
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profile = UserProfile()
        profile.user = request.user
    
    successfully_updated = False
    r = request.POST or request.GET
    page_num = int(r.get('page', '1'))
    if request.POST:
        if page_num == 1:
            user_form = CustomUserChangeForm(request.POST, instance=request.user)
            if user_form.is_valid():
                successfully_updated = True
                user_form.save()
        elif page_num == 2:
            user_profile_form = UserProfileForm(request.POST, instance=profile)
            if user_profile_form.is_valid():
                successfully_updated = True
                user_profile_form.save() 
    if user_form is None:
        user_form = CustomUserChangeForm(instance=request.user)
    if user_profile_form is None:
        user_profile_form = UserProfileForm(instance=profile)
    
    #only allow deletions:
    user_profile_form.fields['contacts'].queryset = profile.contacts
    #help_text hack (help_text might be tied to the widget in future Django versions)
    user_profile_form.fields['contacts'].help_text = 'Add additional contacts by \
        typing their username in the textbox above, and then clicking the add button.'

    
    forms = []   
    user_form.title = 'Personal Info'
    forms.append(user_form)
    user_profile_form.title = 'Contacts / Privacy'
    forms.append(user_profile_form)
    
    #f = MapGroupForm()
    #f.title = 'Map Groups'
    #forms.append(f)
    
    #locals()
    extras = {
        'forms': forms,
        'page_num': page_num,
        'successfully_updated': successfully_updated
    }
    return render_to_response(template_name, extras,
                              context_instance = RequestContext( request))





@login_required
def object_list_form(request, object_type_plural, project=None, return_message=None):
    context = RequestContext(request)
    ModelClass = Base.get_model_from_plural_object_type(object_type_plural)
    template_name = 'profile/%s.html' % ModelClass.name_plural.replace(' ', '-')
    r = request.POST or request.GET
    
    query = None
    if r.get('query') is not None:
        query = QueryParser(r.get('query'))
        #return HttpResponse(json.dumps(query.to_dict_list()))
        if query.error:
            context.update({'error_message': query.error_message})
            query = None
    
    objects = ModelClass.objects.apply_filter(
        user=request.user, query=query)
    
    #return HttpResponse(objects)
    
    projects = Project.objects.get_objects(request.user)
    project_id = 'all'
    per_page = 10
    if project is not None: project_id = str(project.id)
    
    def getModelClassFormSet(**kwargs):
        # uses Django 1.2 workaround documented here:
        # https://groups.google.com/forum/?fromgroups=#!topic/django-users/xImbCAbmfuc
        from django.forms.models import modelformset_factory
        def create_formfield(f, **kwargs):
            return f.formfield(**kwargs) 
        return modelformset_factory(
            ModelClass,
            max_num=0,
            formfield_callback=create_formfield,
            **kwargs
        )
    ModelClassFormSet = getModelClassFormSet(form=ModelClass.inline_form())    
    if request.method == "POST":
        modelformset = ModelClassFormSet(request.POST, queryset=objects)
        if modelformset.is_valid():
            num_updates = 0
            for form in modelformset.forms:
                if form.has_changed():
                    instance = form.instance
                    instance.last_updated_by = request.user
                    instance.time_stamp = datetime.now()
                    instance.save()
                    num_updates += 1
            modelformset.save()
            if num_updates > 0:
                context.update({
                    'message': '%s %s have been updated' % (num_updates, ModelClass.name_plural)
                })
            else:
                context.update({
                    'warning_message': '%s %s have been updated' % (num_updates, ModelClass.name_plural)
                })
        else:
            context.update({
                'error_message': 'There was an error updating the %s' % ModelClass.name_plural
            })
    else:
        start = 0
        if r.get('page') is not None:
            start = (int(r.get('page'))-1)*per_page
        modelformset = ModelClassFormSet(queryset=objects[start:start+per_page])
    context.update({
        'formset': modelformset,
        'page_title': 'My %s' % ModelClass.name_plural.capitalize(),
        'username': request.user.username,
        'url': '%s?1=1' % ModelClass.listing_url(),
        'delete_url': ModelClass.batch_delete_url(),
        'create_url': ModelClass.create_url() + 'embed/',
        'page_title': 'My %s' % ModelClass.name_plural.capitalize(),
        'projects': projects,
        'user': request.user,
        'selected_project': project,
        'selected_project_id': project_id,
        'object_name_plural': ModelClass.name_plural,
        'object_type': ModelClass.name,
        'filter_fields': ModelClass.filter_fields()
    })
    context.update(prep_paginator(request, objects, per_page=per_page))
    if request.user.is_superuser or context.get('is_impersonation'):
        context.update({'users': Project.get_users()})
    return render_to_response(template_name, context)
   
@login_required()
def delete_batch(request, object_type_plural):
    from django.http import HttpResponse
    import json
    r = request.POST
    ModelClass = Base.get_model_from_plural_object_type(object_type_plural)
    object_ids = r.getlist('id')
    projects = []
    num_deletes = 0
    message = ''
    if len(object_ids) > 0:
        groups = list(ModelClass.objects.filter(id__in=object_ids))
        for g in groups:
            g.delete()
            num_deletes = num_deletes+1
            
    message = message + '%s %s(s) were deleted.' % (num_deletes, ModelClass.name)
    return HttpResponse(json.dumps({'message': message }))
 
@login_required()
def create_update_group_with_sharing(request, action, object_type_plural, object_id=None,
                          embed=False, template='account/create_update_group.html',
                          base_template='base/base.html'):
    
    '''
    This view creates and updates permissions for views and projects.  Parameters:
        object_type: valid values are 'projects' or 'views'
        object_id: Integer -- primary key to a Project or View object
        embed:  Whether or not it's an iframe:
        
    In addition, this view also processes a UserAuthorityObject formset, which applies
    user-level permissions to a particular project.
    This form uses the contenttypes framework (so object-user permissions can
    be arbitrarily assigned to more than one object).  Helpful links here:
      * http://hdknr.github.com/docs/django/modules/django/contrib/contenttypes/generic.html
      * http://weispeaks.wordpress.com/2009/11/04/overcoming-limitations-in-django-using-generic-foreign-keys/
    '''
    from django.forms import models, formsets
    from django.contrib.contenttypes import generic
    from localground.apps.site.models import UserAuthorityObject, UserAuthority
    from localground.apps.site.forms import UserAuthorityObjectForm
    from django.http import HttpResponseRedirect
    r = request.POST or request.GET
    ModelClass = Base.get_model_from_plural_object_type(object_type_plural)
    GroupForm = ModelClass.get_form()
    if action == 'share':
        GroupForm = ModelClass.sharing_form()
    if embed: base_template = 'base/iframe.html'
    prefix = 'groupuser'
    group_object = None
    no_shared_users = True
    extra = 0

    #query for model object to update (if object_id is specified):
    try:
        if object_id is not None:
            group_object = ModelClass.objects.get(id=object_id)
            no_shared_users = len(group_object.users.all()) == 0
    except ModelClass.DoesNotExist:
        pass
    if no_shared_users == True: extra = 1
    
    UserAuthorityObjectFormset = generic.generic_inlineformset_factory(
                            UserAuthorityObject, form=UserAuthorityObjectForm,
                            formset=generic.BaseGenericInlineFormSet,
                            ct_field="content_type", fk_field="object_id",
                            extra=extra, can_delete=True)
    extras = {}
    if request.method == 'POST':
        form = GroupForm(request.POST, instance=group_object)
        formset = UserAuthorityObjectFormset(request.POST, instance=group_object, prefix=prefix)
        
        if formset.is_valid() and form.is_valid():
            from django.contrib.contenttypes.models import ContentType
            # ----------------------------
            # PROJECT FORM POST-PROCESSING
            # ----------------------------
            instance = form.instance
            instance.time_stamp = datetime.now()
            
            #determine ContentType:
            app_label = instance._meta.app_label
            model_name = ModelClass.__name__.lower()
            content_type = ContentType.objects.get(app_label=app_label, model=model_name)
                
            if instance.access_authority.id != 2:
                instance.access_key = None
            if instance.pk is None:
                instance.owner = request.user
                is_new = True
            else:
                orig = ModelClass.objects.get(id=object_id)
                if orig.owner != instance.owner:
                    # ensure there's a UserAuthorityObject entry for the old owner for
                    # this object:
                    is_object_user = len(UserAuthorityObject.objects
                                         .filter(user=orig.owner)
                                         .filter(content_type=content_type)
                                         .filter(object_id=object_id)) == 1
                    if not is_object_user:
                        previous_owner = UserAuthorityObject()
                        previous_owner.user = orig.owner
                        previous_owner.content_type = content_type
                        previous_owner.object_id = orig.id
                        previous_owner.authority = UserAuthority.objects.get(id=3)
                        previous_owner.granted_by = request.user
                        previous_owner.time_stamp = datetime.now()
                        previous_owner.save()
            instance.last_updated_by = request.user
            instance.save()
            group_object = instance   
            # -----------------------------------
            # PROJECTUSER FORM(S) POST-PROCESSING
            # -----------------------------------
            marked_for_delete = formset.deleted_forms
            for form in formset.forms:
                if form.has_changed():
                    instance = form.instance
                    if not instance in formset.deleted_forms:
                        instance.granted_by = request.user
                        instance.time_stamp = datetime.now()
                        instance.content_type = content_type
                        instance.object_id = group_object.id
                        instance.save()
            if len(marked_for_delete) > 0:
                formset.save()
            
            # If success, determine which URL to redirect to (either update project or
            # update permissions) so that form doesn't post twice:
            #url = '{0}{1}/?success=true'.format(request.path, group_object.id)
            #url = url.replace('create', 'update') #create URL should redirect to update URL
            url = group_object.update_url() + 'embed/?success=true'
            return HttpResponseRedirect(url)
        else:
            extras.update({
                'success': False,
                'error_message': 'There were errors when updating the %s information.  \
                                Please review message(s) below.' %  ModelClass.name
            })
    else:
        form = GroupForm(instance=group_object)
        formset = UserAuthorityObjectFormset(instance=group_object, prefix=prefix)
    extras.update({
        'form': form,
        'no_users': str(no_shared_users).lower(),
        'formset': formset,
        'prefix': prefix,
        'group_object': group_object,
        'object_name': ModelClass.name,
        'parent_id': object_id,
        'show_hidden_fields': True,
        'base_template': base_template,
        'embed': embed
    })
    if group_object:
        extras.update({ 
            'owner': group_object.owner.username
        })
    if (r.get('success', 'false') in ['1', 'true', 'True']):
        extras.update({
            'success': True,
            'message': 'The %s information was successfully updated.' % ModelClass.name
        })
    return render_to_response(template, extras,
        context_instance=RequestContext(request))
    