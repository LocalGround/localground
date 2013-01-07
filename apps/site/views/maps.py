from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.http import HttpResponse
from localground.apps.site.decorators import process_identity, process_project, \
                                                get_group_if_authorized
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.template import RequestContext    
import simplejson as json
from django.core.context_processors import csrf
from localground.apps.site.models import Scan, Print, Project, View
from django.core.exceptions import ObjectDoesNotExist

@login_required()
@process_identity
def init(request, identity=None):
    u = request.user
    context = RequestContext(request)
    username = identity.username if identity is not None else 'all'
    #set defaults:
    lat, lng, zoom, prints, groups = 21.698265, 14.765625, 3, [], []
    if u.is_authenticated():
        projects = Project.objects.get_objects(identity)
        if request.user.is_superuser and username == 'all':
            projects = Project.objects.all().order_by('name')
        projects = [p.to_dict() for p in projects]
        groups = [] #[g.to_dict() for g in MapGroup.objects.my_groups(u)]
        
        if u.get_profile().default_location is not None:
            lat = u.get_profile().default_location.y
            lng = u.get_profile().default_location.x
            zoom = 14
    context.update({
        'lat': lat,
        'lng': lng,
        'zoom': zoom,
        'projects': json.dumps(projects),
        'num_projects': len(projects),
        'groups': json.dumps(groups)
    })
    return render_to_response('map/viewer.html', context)
    
    
'''TYPE_LU = {
    'projects': Project,
    'views': View
}'''

@get_group_if_authorized
def public_map(request, object_type, slug, group_object, access_key=None):
    u = request.user
    #ModelClass = TYPE_LU.get(object_type)
    #group_object = get_object_or_404(ModelClass, slug=slug)
    context = RequestContext(request)
    #set defaults:
    lat, lng, zoom, prints, groups = 21.698265, 14.765625, 3, [], []
    if u.is_authenticated() and u.get_profile().default_location is not None:
            lat = u.get_profile().default_location.y
            lng = u.get_profile().default_location.x
            zoom = 14
    context.update({
        'lat': lat,
        'lng': lng,
        'zoom': zoom,
        'group_object': group_object,
        'basemap_id': group_object.basemap.id,
        'num_projects': 1,
        'read_only': True
    })
    if access_key is not None:
        context.update({
            'access_key': access_key
         })
    context['%s_id' % group_object.model_name] = group_object.id    
    return render_to_response('map/viewer_public.html', context)