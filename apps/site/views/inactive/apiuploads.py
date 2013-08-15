from django.http import HttpResponse
from localground.apps.site.decorators import process_identity, process_project
import simplejson as json
from django.template import RequestContext
from django.shortcuts import render_to_response
from localground.apps.site.models import PointObject, ObjectTypes, ReturnCodes, Marker


@process_identity
def get_photos(request, identity=None):
    from localground.apps.site.models import Photo
    r = request.GET
    unmatched = r.get('unmatched', 'false').upper() in ['1','TRUE', 'true']
    try:
        photos = Photo.objects.get_my_photos(
                    identity,
                    printID=r.get('printID', None),
                    unmatched=unmatched
            ).to_dict_list()
        dict = {
            'num_records': len(photos),
            'code': 'success',
            'request_parameters': request.GET,
            'photos': photos
        }
        return HttpResponse(json.dumps(dict))
    except Exception:
        return HttpResponse(json.dumps({
                'code': 'error',
                'message': 'General Error',
                'request_parameters': request.GET
            }), status=500)
        

@process_identity
def update_photo(request, identity=None, embed=False,
                 template_name='forms/photo.html', base_template='base/base.html'):
    from localground.apps.site.models import Photo
    from localground.apps.site.forms import PhotoForm
    
    extras = { 'embed': embed, 'base_template': base_template }
    r = request.GET or request.POST
    photo, id = None, -1
    try:
        id = int(r.get('id'))
        photo = Photo.objects.get(id=id)
    except Exception, e:
            extras.update({
                'success': False,
                'message': 'A valid photo id must be provided as a query parameter \
                            (GET or POST; id=valid_id).  You provided: ' + str(r.get('id'))
            })
            return render_to_response(template_name, extras,
                              context_instance = RequestContext( request))
    # if photo found, continue:
    if request.POST:
        photo_form = PhotoForm(request.POST, instance=photo)
        if photo_form.is_valid():
            extras.update({
                'success': True,
                'message': 'The photo was successfully updated.'
            })
            photo_form.save()
        else:
            extras.update({
                'success': False,
                'message': 'There were errors when updating this photo.  \
                                Please review message(s) below.'
            })
    else:
        photo_form = PhotoForm(instance=photo)
    extras.update({ 'form': photo_form, 'photo': photo })
    return render_to_response(template_name, extras,
                              context_instance = RequestContext( request))
    
@process_identity
def get_audio(request, identity=None):
    from localground.apps.site.models import Audio
    r = request.GET
    unmatched = r.get('unmatched', 'false').upper() in ['1','TRUE', 'true']
    try:
        audio = Audio.objects.get_my_audio(
                    identity,
                    printID=r.get('printID', None),
                    unmatched=unmatched
            ).to_dict_list()
        dict = {
            'num_records': len(audio),
            'code': 'success',
            'request_parameters': request.GET,
            'audio': audio
        }
        return HttpResponse(json.dumps(dict))
    except Exception:
        return HttpResponse(json.dumps({
                'code': 'error',
                'message': 'General Error',
                'request_parameters': request.GET
            }), status=500)
        
@process_identity
def update_audio(request, identity=None, embed=False,
                 template_name='forms/audio.html', base_template='base/base.html'):
    from localground.apps.site.models import Audio
    from localground.apps.site.forms import AudioForm
    
    extras = { 'embed': embed, 'base_template': base_template }
    r = request.GET or request.POST
    audio, id = None, -1
    try:
        id = int(r.get('id'))
        audio = Audio.objects.get(id=id)
    except Exception, e:
            extras.update({
                'success': False,
                'message': 'A valid audio id must be provided as a query parameter \
                            (GET or POST; id=valid_id).  You provided: ' + str(r.get('id'))
            })
            return render_to_response(template_name, extras,
                              context_instance = RequestContext( request))
    # if photo found, continue:
    if request.POST:
        audio_form = AudioForm(request.POST, instance=audio)
        if audio_form.is_valid():
            extras.update({
                'success': True,
                'message': 'The audio information was successfully updated.'
            })
            audio_form.save()
        else:
            extras.update({
                'success': False,
                'message': 'There were errors when updating this audio information.  \
                                Please review message(s) below.'
            })
    else:
        audio_form = AudioForm(instance=audio)
    extras.update({ 'form': audio_form, 'audio': audio })
    return render_to_response(template_name, extras,
                              context_instance = RequestContext( request))
    
    
@process_identity
def get_scan_photo_options(request, identity=None):
    from localground.apps.site.models import ImageOpts
    r = request.GET or request.POST
    scan_uuid = r.get('uuid')
    if scan_uuid is None:
        return HttpResponse(json.dumps({
            'success': False,
            'message': 'Scan id must not be None',
            'request_parameters': r
        }), status=500)
    try:
        map_images = (ImageOpts.objects.select_related('source_scan__uuid')
                      .filter(source_scan__uuid=scan_uuid))
        return HttpResponse(json.dumps({
            'success': True,
            'request_parameters': r,
            'map_images': [m.to_dict() for m in map_images]
        }))
    except ImageOpts.DoesNotExist:
        return HttpResponse(json.dumps({
            'success': False,
            'message': 'A scan matching %s could not be found' % (scan_uuid),
            'request_parameters': r
        }), status=500)
    else:
         return HttpResponse(json.dumps({
            'success': False,
            'message': 'Unknown error',
            'request_parameters': r
        }), status=500)
         
@process_identity
def set_scan_photo(request, identity=None):
    from localground.apps.site.models import Scan, ImageOpts
    r = request.GET or request.POST
    scan_uuid = r.get('scan_uuid')
    map_image_id = r.get('map_image_id')
    if scan_uuid is None or map_image_id is None:
        return HttpResponse(json.dumps({
            'success': False,
            'message': 'Scan ID and Map Image ID must not be None',
            'request_parameters': r
        }), status=500)
    try:
        map_image = ImageOpts.objects.get(id=map_image_id)
        scan = Scan.objects.get(uuid=scan_uuid)
        scan.processed_image = map_image
        scan.owner = identity
        scan.save()
        return HttpResponse(json.dumps({
            'success': True,
            'request_parameters': r
        }))
    except ImageOpts.DoesNotExist, Scan.DoesNotExist:
        return HttpResponse(json.dumps({
            'success': False,
            'message': 'A scan & map image matching %s and %s could not be found' \
                        % (scan_uuid, map_image_id),
            'request_parameters': r
        }), status=500)
    else:
         return HttpResponse(json.dumps({
            'success': False,
            'message': 'Unknown error',
            'request_parameters': r
        }), status=500)
    
@process_identity
def update_latlng(request, object_type, object_id, remove=False, identity=None):
    '''
    This function either removes or updates/adds a lat/lng to a point object:
    '''
    r = request.GET or request.POST
    return_code, obj, lat, lng = ReturnCodes.SUCCESS, None, None, None
    try:
        if not remove:
            lat, lng = float(r.get('lat')), float(r.get('lng'))
    except Exception:
        return_code = ReturnCodes.LAT_LNG_REQUIRED
    
    if return_code == ReturnCodes.SUCCESS: 
        obj, return_code = PointObject.get_instance(object_id, object_type, identity)
        if return_code == ReturnCodes.SUCCESS:
            if not remove:
                return_code = obj.update_latlng(lat, lng, identity)
            else:
                return_code = obj.remove_latlng(identity)
    
    return HttpResponse(json.dumps({
        'success': return_code == ReturnCodes.SUCCESS,
        'message': ReturnCodes.get_message(return_code),
        'request_parameters': r,
        'other_parameters': {
            'object_type': object_type,
            'object_id': object_id
        }
    }))
    
#NOTE:  authentication checking going on in the PointObject.get_instance function
def get_object(request, object_type, object_id, identity=None, access_key=None):
    if identity is None:
        identity = request.user
    obj, return_code = PointObject.get_instance(object_id, object_type, identity, access_key=access_key)
    dict = {
        'success': return_code == ReturnCodes.SUCCESS,
        'message': ReturnCodes.get_message(return_code),
        'other_parameters': {
            'object_type': object_type,
            'object_id': object_id
        }    
    }
    if obj is not None:
        if object_type == ObjectTypes.MARKER:
            dict.update({'obj': obj.to_dict(detail=True)})
        else:
            dict.update({'obj': obj.to_dict()})   
    return HttpResponse(json.dumps(dict))
    
@process_identity
def update_object(request, object_type, object_id, identity=None):
    r = request.GET or request.POST
    edits = {}
    if r.get('name') is not None:
        edits.update({'name': r.get('name')})
    if r.get('description') is not None:
        edits.update({'description': r.get('description')})
    if r.get('color') is not None:
        edits.update({'color': r.get('color')})
    
    obj, return_code = PointObject.update_instance(object_id, object_type, identity,
                                                edits)
    d = {
        'success': return_code == ReturnCodes.SUCCESS,
        'message': ReturnCodes.get_message(return_code),
        'return_code': return_code,
        'other_parameters': {
            'object_type': object_type,
            'object_id': object_id,
            'identity': identity.username
        }    
    }
    if obj is not None:
        d.update({'object': obj.to_dict()})
    return HttpResponse(json.dumps(d))
    
@process_identity
def delete_object(request, object_type, object_id, identity=None):
    return_code = PointObject.delete_instance(object_id, object_type, identity)
    return HttpResponse(json.dumps({
        'success': return_code == ReturnCodes.SUCCESS,
        'message': ReturnCodes.get_message(return_code),
        'return_code': return_code,
        'other_parameters': {
            'object_type': object_type,
            'object_id': object_id,
            'identity': identity.username
        }    
    }))
        
@process_identity
@process_project 
def create_object(request, object_type, identity=None, project=None):
    '''
    This function either removes or updates/adds a lat/lng to a point object:
    '''
    r = request.GET or request.POST
    return_code, obj, lat, lng = ReturnCodes.SUCCESS, None, None, None
    try:
        lat, lng = float(r.get('lat')), float(r.get('lng'))
    except Exception:
        return_code = ReturnCodes.LAT_LNG_REQUIRED
    
    if return_code == ReturnCodes.SUCCESS: 
        obj, return_code = PointObject.create_instance(object_type, identity, project, lat, lng)
    return_obj = {
        'success': return_code == ReturnCodes.SUCCESS,
        'message': ReturnCodes.get_message(return_code),
        'request_parameters': r,
        'other_parameters': {
            'object_type': object_type,
            'identity': identity.username,
            'project_id': project.id
        }
    }
    if obj is not None:
        return_obj.update({
            'object': obj.to_dict(aggregate=False)     
        })
    return HttpResponse(json.dumps(return_obj))
    
@process_identity
def append_to_marker(request, marker_id, object_type, object_id, identity=None):
    message, object = None, None
    marker, return_code = PointObject.get_instance(marker_id, 'marker', identity)
    if return_code == ReturnCodes.SUCCESS:
        object, return_code = PointObject.get_instance(object_id, object_type,
                                                        identity)
        if return_code == ReturnCodes.SUCCESS and object.can_edit(identity) and \
            marker.can_edit(identity):
            marker.append(object, identity)
            message = '%s successfully added to marker.' % object_type
        else:
            return_code = ReturnCodes.UNAUTHORIZED
    return HttpResponse(json.dumps({
        'success': return_code == ReturnCodes.SUCCESS,
        'message': message or ReturnCodes.get_message(return_code),
        'marker': marker.to_dict(aggregate=False, detail=True),
        'other_parameters': {
            'marker_id': marker_id,
            'object_type': object_type,
            'object_id': object_id
        }
    }))

@process_identity
def remove_from_marker(request, object_type, object_id, identity=None):
    object, return_code = PointObject.get_instance(object_id, object_type, identity)
    if return_code == ReturnCodes.SUCCESS:
        if object.can_edit(identity):
            object.source_marker = None
            object.save()
        else:
            return_code = ReturnCodes.UNAUTHORIZED    
    return HttpResponse(json.dumps({
        'success': return_code == ReturnCodes.SUCCESS,
        'message': ReturnCodes.get_message(return_code),
        'other_parameters': {
            'object_type': object_type,
            'object_id': object_id
        }
    }))
        

