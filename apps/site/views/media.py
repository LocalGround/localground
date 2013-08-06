from localground.apps.lib.helpers.generic import prep_paginator
from django.http import HttpResponse
from localground.apps.site.decorators import process_identity, process_project
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from localground.apps.site.models import (Scan, Attachment, Audio, Photo, Video,
                                          StatusCode, Print, Project)
import simplejson as json
from datetime import datetime

def _get_object_variables(object_type):
    #from django.db.models import get_model
    #ModelClass = get_model('account','project')
    class_name, template_name = None, None
    if object_type == 'audio':
        class_name, template_name = Audio, 'profile/audio.html'
    elif object_type == 'photo': 
        class_name, template_name = Photo, 'profile/photos.html'
    elif object_type == 'video': 
        class_name, template_name = Video, 'profile/video.html'
    elif object_type == 'map-image': 
        class_name, template_name = Scan, 'profile/scans.html'
    elif object_type == 'attachment': 
        class_name, template_name = Attachment, 'profile/attachments.html'
    elif object_type == 'print': 
        class_name, template_name = Print, 'profile/site.html'
    return class_name, template_name
    

@login_required()
@process_identity
@process_project 
def get_objects(request, object_type, identity=None, project=None, return_message=None):
    context = RequestContext(request)
    r = request.GET or request.POST
    is_barcoded = (object_type == 'map-image' or object_type == 'attachment')
    objects = None
    class_name, template_name = _get_object_variables(object_type)
    if class_name is None:
        return HttpResponse('object_type "%s" is invalid' % (object_type))
     
    #update form values, if form post:   
    if request.POST:
        return_message = _batch_update(request, object_type, class_name, identity)
     
    ordering_field = None #'-id'   
    if project is not None:
        objects = class_name.objects.by_project(project, ordering_field=ordering_field)
    else:
        objects = class_name.objects.get_all(ordering_field=ordering_field, user=identity)
        #if identity is not None:
        #    objects = objects.filter(owner=identity)
    username = identity.username if identity is not None else 'all'
    projects = Project.objects.get_objects(identity)
    if request.user.is_superuser and username == 'all':
        projects = Project.objects.all().order_by('name')
    project_id = 'all'
    if project is not None: project_id = str(project.id)
    
    context.update({
        'username': username,
        'url': '/profile/%s/?a=a' % object_type,
        #'project_url': '/profile/%s/?alias=%s' % (object_type, username),
        #'user_url': '/profile/%s/?project_id=%s' % (object_type, project_id),
        'raw_url': '/profile/%s/' % (object_type),
        'projects': projects,
        'selected_project': project,
        'selected_project_id': project_id,
        'object_type': object_type.replace('-', ' ')
    })
    if is_barcoded:
        context.update({ 'statuses': StatusCode.objects.all().order_by('id') })    
    if return_message is not None:
        context.update({ 'return_message': return_message })
    if request.user.is_superuser or context.get('is_impersonation'):
        context.update({'users': Project.get_users()})
    context.update(prep_paginator(request, objects))
    return render_to_response(template_name, context)
    
    
def _batch_update(request, object_type, class_name, identity):
    #todo:  check permissions:
    r = request.POST
    ids = []
    name_dict = {}
    description_dict = {}
    tags_dict = {}
    status_dict = {}
    qr_dict = {}
    attrib_dict = {}
    date_dict = {}
    time_dict = {}
    datetime_dict = {}
    accesskey_dict = {}
    
    is_barcoded = (object_type == 'map-image' or object_type == 'attachment')
    is_print = (object_type == 'print')
    is_project = (object_type == 'project')

    for k, v in r.items():
        #build name dictionary
        if k.find('name_') != -1:
            id = k.split('_')[1]
            ids.append(id)
            name_dict.update({ id: v })
        
        #build description dictionary
        if k.find('description_') != -1:
            id = k.split('_')[1]
            description_dict.update({ id: v })
            
        #build tags dictionary
        if k.find('tags_') != -1:
            id = k.split('_')[1]
            tags_dict.update({ id: v })
            
        #build attribution dictionary
        if k.find('attribution_') != -1:
            id = k.split('_')[1]
            attrib_dict.update({ id: v })
           
        #build date dictionary: 
        if k.find('date_') != -1:
            id = k.split('_')[1]
            date_dict.update({ id: v })
        
        #build time dictionary: 
        if k.find('time_') != -1:
            id = k.split('_')[1]
            time_dict.update({ id: v })
            
        if is_barcoded:           
            if k.find('status_') != -1:
                id = k.split('_')[1]
                status_dict.update({ id: v })
            
            if k.find('qrcode_') != -1:
                id = k.split('_')[1]
                qr_dict.update({ id: v })
        #think about this more:
        '''elif is_project:
            if k.find('accesskey_') != -1:
                id = k.split('_')[1]
                accesskey_dict.update({ id: v })''' 
                
    objects = list(class_name.objects.filter(id__in=ids))
    #return HttpResponse(objects)
    num_updates = 0
    for o in objects:
        id = str(o.id) #convert to string to accomodate scan and media ids

        #build datetime dict:
        d, t = date_dict.get(id), time_dict.get(id)
        if d is not None and t is not None and \
                len(d.strip()) > 0 and len(t.strip()) > 0:
            try:
                datetime_dict[id] = datetime.strptime('%s %s' % (d, t),
                                                 '%m/%d/%Y %I:%M:%S %p')    
            except:
                pass
        
        #if something has changed
        something_changed = o.description != description_dict.get(id)
        
        if is_barcoded:
            something_changed = something_changed or \
                                str(o.status.id) != (status_dict.get(id, str(o.status.id))) \
                                or o.qr_code != qr_dict.get(id)
        elif not is_print:
            #if is_project:
            #    something_changed = something_changed or 
            something_changed = something_changed or o.tags != tags_dict.get(id) or \
                                    o.attribution != attrib_dict.get(id) or \
                                    o.name != name_dict.get(id)
        if not is_print:
            something_changed = something_changed or o.created_timestamp != datetime_dict.get(id)
        else:
            something_changed = something_changed or o.map_title != name_dict.get(id)   
        
        if something_changed: #do update
            if o.name != name_dict.get(id):
                if is_print:
                    o.map_title = name_dict.get(id)
                else:
                    o.name = name_dict.get(id)
            
            if o.description != description_dict.get(id):
                o.description = description_dict.get(id)
             
            #scans don't have tags
            if not is_barcoded and not is_print:
                if o.tags != tags_dict.get(id):
                    o.tags = tags_dict.get(id)
            
            #prints don't have created_timestamp or attribution
            if not is_print:
                o.created_timestamp = datetime_dict.get(id)
                if o.attribution != attrib_dict.get(id):
                    o.attribution = attrib_dict.get(id)
            
            #only scans & attachments have statuses
            if is_barcoded and status_dict.get(id) is not None:
                if o.status.id != status_dict.get(id):
                    o.status = StatusCode.objects.get(id=(status_dict.get(id)))
                if o.qr_code != qr_dict.get(id):
                    qr_code = qr_dict.get(id)
                    if len(qr_code) != 8:
                        qr_code = None
                    o.qr_code = qr_code
                    
            o.last_updated_by = identity
            o.save()
            num_updates = num_updates+1
    
    #return message
    return '%s %s(s) have been updated' % (num_updates, object_type.replace('-', ' '))
    
@login_required()
@process_identity    
def delete_object(request, object_type, object_id, identity=None):
    class_name, template_name = _get_object_variables(object_type)
    message = class_name.objects.delete_by_ids([object_id], identity)
    return HttpResponse(json.dumps({'message': message }))

@login_required()
@process_identity  
def delete_objects(request, object_type, identity=None):
    class_name, template_name = _get_object_variables(object_type)
    r = request.POST or request.GET
    ids = r.getlist('id')
    message = class_name.objects.delete_by_ids(ids, identity)
    return HttpResponse(json.dumps({'message': message }))
    
'''@login_required()
@process_identity  
def reprocess(request, object_type, identity=None):
    if object_type != 'map-image':
        return HttpResponse(json.dumps({
            'message': 'Reprocessing is only implement for map images',
            'error': True
        }))
    r = request.POST or request.GET
    ids = r.getlist('id')
    message = Scan.objects.reprocess_by_ids(ids, identity)
    return HttpResponse(json.dumps({
        'message': message,
        'error': False
    }))'''
    
@login_required()
@process_identity
def move_to_project(request, object_type, identity=None):
    class_name, template_name = _get_object_variables(object_type)
    r = request.POST or request.GET
    project_id = r.get('new_project')
    message = class_name.objects.move_project(
        project_id, r.getlist('id'), confirm=r.get('just_validate') is not None)
    return HttpResponse(json.dumps({'message': message }))

