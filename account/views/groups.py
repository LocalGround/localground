"""
Contains views for creating, editing and updating permissions for View and Project objects.
"""
from django.http import HttpResponse, HttpResponseRedirect
from localground.lib.generic import prep_paginator
from localground.lib.api.decorators import process_identity
from django.contrib.auth.decorators import login_required
from django.contrib.contenttypes import generic
from localground.account.models import Project, View, UserAuthorityObject, UserAuthority
from localground.account.forms import (
    UserAuthorityObjectForm, ProjectPermissionsForm, ProjectCreateForm, ProjectUpdateForm, \
    ViewPermissionsForm, ViewCreateForm, ViewUpdateForm
)
import simplejson as json
from datetime import datetime
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.contenttypes.models import ContentType
            

Form_LU = {
    'projects': {
        'model_class': Project,
        'forms': {
            'create': ProjectCreateForm,
            'update': ProjectUpdateForm,
            'update-sharing': ProjectPermissionsForm
        }
    },
    'views': {
        'model_class': View,
        'forms': {
            'create': ViewCreateForm,
            'update': ViewUpdateForm,
            'update-sharing': ViewPermissionsForm
        }
    }
}

@login_required()
def create_update_project(request, object_type, edit_type, object_id=None,
                          embed=False, template='create_update_group.html',
                          base_template='twitter/base.html'):
    '''
    This view creates and updates permissions for views and projects.  Parameters:
        object_type: valid values are 'projects' or 'views'
        edit_type: valid values are 'create', 'update' or 'update-sharing'
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
    r = request.POST or request.GET
    ModelClass = Form_LU.get(object_type).get('model_class')
    GroupForm = Form_LU.get(object_type).get('forms').get(edit_type)
    if embed: base_template = 'twitter/iframe.html'
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
            suffix = ''
            if embed: suffix = 'embed/'
            url = '/profile/%s/%s/%s%s/?success=true' % (
                        object_type, edit_type.replace('create', 'update'),
                        suffix, group_object.id
            )
            return HttpResponseRedirect(url)
        else:
            extras.update({
                'success': False,
                'message': 'There were errors when updating the %s information.  \
                                Please review message(s) below.' %  ModelClass.__name__.lower()
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
        'object_name': ModelClass.__name__,
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
            'message': 'The %s information was successfully updated.' % group_object.model_name
        })
    return render_to_response(template, extras,
        context_instance=RequestContext(request))

@login_required()
@process_identity  
def show_group_list(request, object_type='projects', identity=None, return_message=None):
    """
    The landing page in the "profile" section of Local Ground, where the user
    gets to view the projects/views to which s/he is authorized.
    """
    from localground.account.models import Project, View
    context = RequestContext(request)
    r = request.GET or request.POST
    object_list, object_name = None, None
    ModelClass = Form_LU.get(object_type).get('model_class')
    if request.POST:
        return_message = _batch_update(request, ModelClass, identity)
    object_list = ModelClass.objects.get_objects_with_counts(identity, ordering='id')
    group_object = ModelClass()
    context.update({
        'username': identity.username if identity is not None else 'all',
        'object_list': object_list,
        'group_object': group_object,
        'raw_url': '/profile/%s/?a=a' % object_type, #todo: deprecate
        'url': '/profile/%s/?a=a' % object_type,
        'url_raw': '/profile/%s/?a=a' % object_type, #todo: deprecate
        'object_type': object_type
    })
    if return_message is not None:
        context.update({ 'return_message': return_message })
    if request.user.is_superuser or context.get('is_impersonation'):
        context.update({'users': Project.get_users()})
    context.update(prep_paginator(request, object_list))
    return render_to_response('groups.html', context)
    
def _batch_update(request, ModelClass, identity):
    """
    Private method that allows users to batch-update the names and descriptions
    of their views / projects.  Needs to be re-written to use inline formsets
    (for better error handling / readability).
    """
    r = request.POST
    object_ids = []
    name_dict = {}
    description_dict = {}
    for k, v in r.items():
        #build name dictionary
        if k.find('name_') != -1:
            id = int(k.split('_')[1])
            object_ids.append(id)
            name_dict.update({ id: v })
        
        #build description dictionary
        if k.find('description_') != -1:
            id = int(k.split('_')[1])
            description_dict.update({ id: v })
        
    
    groups = list(ModelClass.objects.filter(id__in=object_ids))
    num_updates = 0
    for g in groups:
        name_changed = g.name != name_dict.get(g.id)
        desc_changed = g.description != description_dict.get(g.id)
        #if something has changed
        if name_changed or desc_changed:
            #do update
            if name_changed:
                g.name = name_dict.get(g.id)
            if desc_changed:
                g.description = description_dict.get(g.id)
            g.user = identity
            g.time_stamp = datetime.now()
            g.save()
            num_updates = num_updates+1
    
    #re-render page:
    return '%s %s(s) have been updated' % (num_updates, ModelClass.__name__)
    #return HttpResponse(projects)
    #return get_projects(request, return_message=message)
    
    
    
@login_required()
@process_identity  
def delete_groups(request, object_type, identity=None):
    #return HttpResponse(json.dumps({'message': 'Still thinking about how to \
    #                                implement this...bear with me...' }))
    """
    View that permanently deletes a group and all of the media associated with
    it (in the database and on the file system).  Really needs to be thought
    through a lot more.
   
    Todo:  How I think this should work:
        If a user deletes a project, warn user about all of the dependencies
        that will also get deleted:
            * map images
            * photos
            * audio
            * video
            * markers
            * prints (if they're not also associated with other projects)
            * records in tables:
              Complicated:
                1) query all forms to which the user has access.
                2) then look for project references in the associated table
                   and delete those records.
        If user confirms, get rid of everything!  Don't forget to remove file
        system references too.
    """
    r = request.POST
    ModelClass = Form_LU.get(object_type).get('model_class')

    object_ids = r.getlist('id')
    #map(int,object_ids)
    projects = []
    num_deletes = 0
    message = ''
    if len(object_ids) > 0:
        groups = list(ModelClass.objects.filter(id__in=object_ids))
        #return HttpResponse('num projects: ' + str(len(projects)))
        for g in groups:
            #important:  delete does a cascading delete!
            #https://docs.djangoproject.com/en/dev/topics/db/queries/#deleting-objects
            
            #try:
            g.delete()
            num_deletes = num_deletes+1
            #except:
            #    message = message + 'There was a problem deleting project #' + str(p.id) + '; '
            
    message = message + '%s %s(s) were deleted.' % (num_deletes, ModelClass.__name__)
    return HttpResponse(json.dumps({'message': message }))
    #re-render page:
    #return get_projects(request, return_message=message)
    
    
def associate_view_with_data(request, object_id=None):
    from localground.account.models.permissions import EntityGroupAssociation, ObjectAuthority
    from localground.overlays.models import Marker
    from localground.uploads.models import Photo, Audio, Scan
    
    r = request.POST or request.GET
    create_new = False
    if object_id is not None:
        try:
            view = View.objects.get(id=object_id)
        except View.DoesNotExist:
            create_new = True
    else:
        create_new = True
    if create_new:
        view = View()
        view.owner = request.user
        view.access_authority = ObjectAuthority.objects.get(id=1)
        view.slug = r.get('name').strip().lower().replace(' ', '-')
        view.slug += '-%s' % datetime.now().microsecond
    
    view.name = r.get('name')
    view.save()
    
    #delete all associations:
    view.entities.all().delete()
    
    try: photo_ids = [int(id) for id in r.get('photo_ids').split(',')]
    except: photo_ids = []
    try: audio_ids = [int(id) for id in r.get('audio_ids').split(',')]
    except: audio_ids = []
    try: marker_ids = [int(id) for id in r.get('marker_ids').split(',')]
    except: marker_ids = []
    try: scan_ids = [int(id) for id in r.get('paper_ids').split(',')]
    except: scan_ids = []
    
    entities = [
        {'cls': Photo, 'model_name': 'photo', 'ids': photo_ids, 'app_label': 'uploads' },
        {'cls': Audio, 'model_name': 'audio', 'ids': audio_ids, 'app_label': 'uploads' },
        {'cls': Scan, 'model_name': 'scan', 'ids': scan_ids, 'app_label': 'uploads' },
        {'cls': Marker, 'model_name': 'marker', 'ids': marker_ids, 'app_label': 'overlays' },
    ]
    for entity in entities:
        ids = verify(entity.get('cls'), entity.get('ids'), request.user)
        for id in ids:
            assoc = EntityGroupAssociation()
            assoc.user = request.user
            assoc.ordering = id
            assoc.turned_on = True
            assoc.group_type = ContentType.objects.get(app_label='account', model='view')
            assoc.group_id = view.id
            assoc.entity_type = ContentType.objects.get(
                    app_label=entity.get('app_label'), model=entity.get('model_name'))
            assoc.entity_id = id
            assoc.save()
    if r.get('detail') is not None:
        return HttpResponse(json.dumps(view.to_dict(
            include_auth_users=True, include_processed_maps=True,
            include_markers=True, include_audio=True, include_photos=True,
            include_notes=True     
        )))
    else:
        return HttpResponse(json.dumps(view.to_dict()))
        
    
def verify(cls, ids, user, access_key=None):
    '''
    Because GenericForeignKeys don't actually check to make sure that the id is
    valid (i.e. there are no database constraints that enforce integrity), and
    we need to be sure that users are authorized to add media to a view, this
    function makes sure everything's kosher.
    '''
    verified_ids = []
    #query the database to make sure ids correspond to objects
    objects = list(cls.objects.filter(id__in=ids))
    
    # loop through to verify permissions.  Question:  what happens if access
    # is restricted after a user has created a view?
    for o in objects:
        if o.project.can_view(user, access_key=access_key):
            verified_ids.append(o.id)
    return verified_ids
     
