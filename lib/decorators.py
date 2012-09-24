#!/usr/bin/env python
from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
import json
from localground.account.models import Project, View

def get_group_if_authorized(function):
    '''
    Examines view / project and determines if it's accessible.
    1) query for group
    2) is it public?  if so, return
    3) is it public w/key?  if so, check key:
        key match:  return
        key failure: go to step 4
    4) does logged-in user have access?
        has access:  return
        doesn't have access: redirect to error page    
    '''
    def wrapper(request, object_type, slug=None, object_id=None, access_key=None, to_json=False, *args, **kwargs):
        r = request.GET
        TYPE_LU = {
            'projects': Project,
            'views': View
        }
        ModelClass = TYPE_LU.get(object_type)
        try:
            if slug is not None:
                group_object = ModelClass.objects.get(slug=slug)
            elif object_id is not None:
                group_object = ModelClass.objects.get(id=object_id)
            else:
                group_object = ModelClass.objects.get(id=r.get('id'))    
        except:
            return _render_exception('Not found', to_json=to_json)
        if not group_object.can_view(request.user, access_key):
            return _render_exception('Not authorized', to_json=to_json)   
        return function(request, object_type, slug, group_object, access_key=access_key, *args, **kwargs)
    return wrapper

def _render_exception(message, to_json=False):
    if not to_json: return HttpResponse(message)
    else: return HttpResponse(json.dumps({'success': False, 'message': message}))

