from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template import RequestContext    
import simplejson as json
from localground.apps.site.models import Project

def show_ebays_map_viewer(request):
    context = RequestContext(request)
    #set defaults:
    lat, lng, zoom = 37.80937, -122.297465, 11
    
    context.update({
        'lat': lat,
        'lng': lng,
        'zoom': zoom,
        'ebays': True,
        'read_only': True
    })
    return render_to_response('ebays/viewer.html', context)

@login_required()
def show_ebays_map_editor(request):
    u = request.user
    context = RequestContext(request)
    #set defaults:
    lat, lng, zoom = 37.80937, -122.297465, 11
    
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
        'ebays': True
    })
    return render_to_response('ebays/editor.html', context)


