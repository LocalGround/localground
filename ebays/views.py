from django.template import RequestContext    
import simplejson as json
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from localground.account.models import Project

@login_required()
def init(request):
    u = request.user
    context = RequestContext(request)
    #set defaults:
    lat, lng, zoom, prints = 21.698265, 14.765625, 3, []
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
        'ebays': True
    })
    return render_to_response('ebays/index.html', context)