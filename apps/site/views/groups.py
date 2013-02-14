"""
Contains views for creating, editing and updating permissions for View and Project objects.
"""
from django.http import HttpResponse, HttpResponseRedirect
from localground.apps.helpers.generic import prep_paginator
from localground.apps.site.decorators import process_identity
from django.contrib.auth.decorators import login_required
from django.contrib.contenttypes import generic
from localground.apps.site.models import (Project, View, UserAuthorityObject,
    UserAuthority)
from django.db.models.loading import get_model
import simplejson as json
from datetime import datetime
from django.shortcuts import render_to_response
from django.template import RequestContext



@login_required()
@process_identity  
def show_group_list(request, object_type='projects', identity=None, return_message=None):
    """
    The landing page in the "profile" section of Local Ground, where the user
    gets to view the projects/views to which s/he is authorized.
    """
    from localground.apps.site.models import Project, View
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
    return render_to_response('account/groups.html', context)
    
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
     
