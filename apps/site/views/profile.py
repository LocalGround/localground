#!/usr/bin/env python
from django.http import Http404, HttpResponse
from localground.apps.lib.helpers import prep_paginator, QueryParser
from django.template import TemplateDoesNotExist, RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required 
from django.db.models.loading import get_model
from datetime import datetime
from localground.apps.site.models import Base, Project, Form, Field
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
        profile = UserProfile.create(request.user)
    
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


@login_required()
def object_list_form(request, object_type_plural, return_message=None):
    context = RequestContext(request)
    ModelClass = Base.get_model(model_name_plural=object_type_plural)
    template_name = 'profile/%s.html' % ModelClass.model_name_plural.replace(' ', '-')
    r = request.POST or request.GET
    
    query = None
    if r.get('query') is not None and len(r.get('query').strip()) > 0:
        query = QueryParser(ModelClass, r.get('query'))
        #return HttpResponse(json.dumps(query.to_dict_list()))
        if query.error:
            context.update({'error_message': query.error_message})
            query = None
    
    objects = ModelClass.objects.apply_filter(
        user=request.user, query=query)
    
    per_page = 10
    
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
                    'message': '%s %s have been updated' % (num_updates, ModelClass.model_name_plural)
                })
            else:
                context.update({
                    'warning_message': '%s %s have been updated' % (num_updates, ModelClass.model_name_plural)
                })
        else:
            context.update({
                'error_message': 'There was an error updating the %s' % ModelClass.model_name_plural
            })
    else:
        start = 0
        if r.get('page') is not None:
            start = (int(r.get('page'))-1)*per_page
        modelformset = ModelClassFormSet(queryset=objects[start:start+per_page])
        
    filter_fields = ModelClass.filter_fields()
        
    context.update({
        'formset': modelformset,
        'page_title': 'My %s' % ModelClass.model_name_plural.capitalize(),
        'username': request.user.username,
        'url': '%s?1=1' % ModelClass.listing_url(),
        'delete_url': ModelClass.batch_delete_url(),
        'create_url': ModelClass.create_url() + 'embed/',
        'page_title': 'My %s' % ModelClass.model_name_plural.capitalize(),
        'user': request.user,
        'object_name_plural': ModelClass.model_name_plural,
        'object_type': ModelClass.model_name,
        'filter_fields': filter_fields
    })

    if query is not None:
        filter_fields = query.populate_filter_fields()
        context.update({
            'filter_fields': filter_fields,
            'sql': query.query_text,
            'has_filters': len(query.where_conditions) > 0,
            'url': '%s?query=%s' % (ModelClass.listing_url(), query.query_text),
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
    ModelClass = Base.get_model(model_name_plural=object_type_plural)
    object_ids = r.getlist('id')
    projects = []
    num_deletes = 0
    message = ''
    if len(object_ids) > 0:
        groups = list(ModelClass.objects.filter(id__in=object_ids))
        for g in groups:
            g.delete()
            num_deletes = num_deletes+1
            
    message = message + '%s %s(s) were deleted.' % (num_deletes, ModelClass.model_name)
    return HttpResponse(json.dumps({'message': message }))


    