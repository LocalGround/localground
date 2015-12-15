from django.shortcuts import render_to_response
from localground.apps.site import models
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.template import RequestContext
import json
from django.contrib.gis.geos import Point
from django.http import HttpResponse

#shorthand for debugging
layout_id_map = {'landscape': 1, 'portrait': 2}

def generate_print_pdf(request):
    r = request.GET or request.POST

    project = None
    project = models.Project.objects.get(id=r.get('project_id'))

    # initialize variables / data based on query params:
    map_provider = models.WMSOverlay.objects.get(
        id=int(r.get('map_provider', settings.DEFAULT_BASEMAP_ID)))

    # get / create form (if requested):
    layers, layer_ids = [], []
    scan_ids = []
    if r.get('scan_ids') is not None and len(r.get('scan_ids')) > 0:		
        scan_ids = [n for n in r.get('scan_ids').split(',')]

    layouts = models.Layout.objects.filter(is_active=True).order_by('id', )
    layout_id = layout_id_map[r.get('orientation')]
    layout = models.Layout.objects.get(id=layout_id)
    zoom = int(r.get('zoom', 17))
    profile = models.UserProfile.objects.get(user=request.user)

    center_lat = float(r.get('center_lat'))
    center_lng = float(r.get('center_lng'))
    center = Point(center_lng, center_lat, srid=4326)
    

    map_title = r.get('map_title', None)
    instructions = r.get('instructions', None)
    if instructions is not None:  # preserve line breaks in the pdf report
        instructions = '<br/>'.join(instructions.splitlines())

    extras = {}

    p = models.Print.insert_print_record(
            request.user,
            project,
            layout,
            map_provider,
            zoom,
            center,
            request.get_host(),
            map_title=r.get('map_title'),
            instructions=r.get('instructions'),
            layer_ids=None,
            scan_ids=scan_ids
        )
    p.generate_pdf()

    #just return pdf location
    #return HttpResponse(p.pdf())
    return p

@login_required
def generate_print(request, template_name='map/print_new.html'):
    r = request.GET

    project = None
    if r.get('project_id'):
        project = models.Project.objects.get(id=r.get('project_id'))
    else:
        project = models.Project.get_default_project(request.user)
    
    # generate PDF if POST request:
    if request.method == "POST":
        print_obj = generate_print_pdf(request)
        return HttpResponse(json.dumps({
            'map': print_obj.thumb(),
            'pdf': print_obj.pdf(),
            'project_id': project.id
        }))

    # initialize variables / data based on query params:
    map_provider = models.WMSOverlay.objects.get(
        id=int(r.get('map_provider', settings.DEFAULT_BASEMAP_ID)))
    
    layouts = models.Layout.objects.filter(is_active=True).order_by('id', )
    layout_id = int(r.get('layout', 1))
    layout = models.Layout.objects.get(id=layout_id)

    zoom = int(r.get('zoom', 17))
    profile = models.UserProfile.objects.get(user=request.user)


    # set lat / lng (including defaults, if not defined any other way):
    center_lat, center_lng = 55.16, 61.4
    if profile.default_location is not None:
        center_lat = profile.default_location.y
        center_lng = profile.default_location.x
    center_lat = float(r.get('center_lat', center_lat))
    center_lng = float(r.get('center_lng', center_lng))
    center = Point(center_lng, center_lat, srid=4326)
    map_title = r.get('map_title', None)
    instructions = r.get('instructions', None)
    if instructions is not None:  # preserve line breaks in the pdf report
        instructions = '<br/>'.join(instructions.splitlines())

    extras = {}
    layers, layer_ids = [], []
    scans, scan_ids = [], []
    scans, scan_ids = [], []
    if r.get('scan_ids') is not None and len(r.get('scan_ids')) > 0:		
        scan_ids = [n for n in r.get('scan_ids').split(',')]		
        scans = models.Scan.objects.select_related(		
            'source_print').filter(id__in=scan_ids).to_dict_list()
        
    extras.update({
        'width': layout.map_width_pixels,
        'height': layout.map_height_pixels,
        'zoom': zoom,
        'center_lat': center_lat,
        'center_lng': center_lng,
        'basemap_id': map_provider.id,
        'basemap_provider_id': map_provider.name,
        'layer_ids': json.dumps(layer_ids),
        'layer_id_string': r.get('layer_ids'),
        'scan_id_string': r.get('scan_ids'),
        'scans': json.dumps(scans),
        'layouts': json.dumps([l.to_dict() for l in layouts]),
        'selectedLayout_id': layout.id,
        'map_title': map_title,
        'instructions': instructions,
        'selected_project': project
    })
    
    return render_to_response(template_name, extras,
                              context_instance=RequestContext(request))
