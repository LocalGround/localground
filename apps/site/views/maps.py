from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.http import HttpResponse
from localground.apps.site.decorators import get_group_if_authorized
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.template import RequestContext    
import simplejson as json
from django.core.context_processors import csrf
from django.contrib.auth.models import User
from localground.apps.site.models import Base, Scan, Print, Project, View
from django.core.exceptions import ObjectDoesNotExist

def show_map_viewer(request, username, slug, access_key=None):
    u = request.user
    source_object = Project.objects.get(
        slug=slug, owner=User.objects.get(username=username)
    )
    context = RequestContext(request)
    
    #set defaults:
    lat, lng, zoom = 21.698265, 14.765625, 3
    if u.is_authenticated() and u.get_profile().default_location is not None:
            lat = u.get_profile().default_location.y
            lng = u.get_profile().default_location.x
            zoom = 14
    context.update({
        'lat': lat,
        'lng': lng,
        'zoom': zoom,
        'source_object': source_object,
        'basemap_id': 4, #source_object.basemap.id,
        'num_projects': 1,
        'read_only': True
    })
    if access_key is not None:
        context.update({
            'access_key': access_key
         })
    context['%s_id' % source_object.model_name] = source_object.id    
    return render_to_response('map/viewer.html', context)


@login_required()
def show_map_editor(request):
    u = request.user
    context = RequestContext(request)
    username = u.username
    #set defaults:
    lat, lng, zoom = 21.698265, 14.765625, 3
    if u.is_authenticated():
        projects = Project.objects.get_objects(u)
        projects = [p.to_dict() for p in projects]
        if u.get_profile().default_location is not None:
            lat = u.get_profile().default_location.y
            lng = u.get_profile().default_location.x
            zoom = 14
    context.update({
        'lat': lat,
        'lng': lng,
        'zoom': zoom,
        'projects': json.dumps(projects),
        'num_projects': len(projects)
    })
    return render_to_response('map/editor.html', context)


def show_ebays_map_viewer(request):
    context = RequestContext(request)
    #set defaults:
    lat, lng, zoom = 21.698265, 14.765625, 3
    
    context.update({
        'lat': lat,
        'lng': lng,
        'zoom': zoom,
        'ebays': True,
        'basemap_id': 4,
        'read_only': True
    })
    return render_to_response('ebays/viewer.html', context)

@login_required()
def show_ebays_map_editor(request):
    u = request.user
    context = RequestContext(request)
    #set defaults:
    lat, lng, zoom = 21.698265, 14.765625, 3
    
    projects = Project.objects.get_objects(u)
    projects = [p.to_dict() for p in projects]

    if u.get_profile().default_location is not None:
        lat = u.get_profile().default_location.y
        lng = u.get_profile().default_location.x
        zoom = 14
    context.update({
        'lat': lat,
        'lng': lng,
        'zoom': zoom,
        'projects': json.dumps(projects),
        'ebays': True,
        'basemap_id': 4
    })
    return render_to_response('ebays/editor.html', context)


