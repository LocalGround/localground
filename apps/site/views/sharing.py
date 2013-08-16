from django.template import TemplateDoesNotExist, RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from localground.apps.lib.helpers import get_timestamp_no_milliseconds

@login_required()
def create_update_group_with_sharing(request, action, object_type_plural, object_id=None,
                          embed=False, template='profile/create_update_group.html',
                          base_template='base/profile.html'):
    
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
    from localground.apps.site.models import Base, UserAuthorityObject, UserAuthority
    from localground.apps.site.forms import UserAuthorityObjectForm
    from django.http import HttpResponseRedirect
    r = request.POST or request.GET
    ModelClass = Base.get_model(model_name_plural=object_type_plural)
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
            instance.time_stamp = get_timestamp_no_milliseconds()
            
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
                        previous_owner.time_stamp = get_timestamp_no_milliseconds()
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
                        instance.time_stamp = get_timestamp_no_milliseconds()
                        instance.content_type = content_type
                        instance.object_id = group_object.id
                        instance.save()
            if len(marked_for_delete) > 0:
                formset.save()
            
            # If success, determine which URL to redirect to (either update project or
            # update permissions) so that form doesn't post twice:
            #url = '{0}{1}/?success=true'.format(request.path, group_object.id)
            #url = url.replace('create', 'update') #create URL should redirect to update URL
            url = group_object.update_url()
            if action == 'share':
                url = group_object.share_url()
            if embed:
                url += 'embed/'
            url += '?success=true'
            return HttpResponseRedirect(url)
        else:
            extras.update({
                'success': False,
                'error_message': 'There were errors when updating the %s information.  \
                                Please review message(s) below.' %  ModelClass.model_name
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
        'object_name': ModelClass.model_name,
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
            'message': 'The %s information was successfully updated.' % ModelClass.model_name
        })
    return render_to_response(template, extras,
        context_instance=RequestContext(request))