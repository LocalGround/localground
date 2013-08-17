from django.shortcuts import render_to_response
from localground.apps.site import models
from django.contrib.auth.decorators import login_required
from django.conf import settings  
from django.template import RequestContext 
import json
from django.contrib.gis.geos import Point

@login_required()
def generate_print(request, is_json=False, project=None, embed=False,
				 template_name='map/print.html', base_template='base/print_fullscreen.html'):
	
	project = models.Project.get_default_project(request.user)
	r = request.GET or request.POST
	is_form_requested = r.get('short_form') is not None or \
						r.get('long_form') is not None
	
	#initialize variables / data based on query params:
	map_provider = models.WMSOverlay.objects.get(
					id=int(r.get('map_provider', settings.DEFAULT_BASEMAP_ID)))

	#get / create form (if requested):
	form = None
	if is_form_requested:
		#get existing form:
		if r.get('form_id') != '-1' and r.get('form_id') is not None:
			form = models.Form.objects.get(id=int(r.get('form_id', 1)))
	
	
	forms = models.Form.objects.filter(owner=request.user).order_by('name',)
	layers, layer_ids = [], []
	if r.get('layer_ids') is not None and len(r.get('layer_ids')) > 0:
		layer_ids = [int(n) for n in r.get('layer_ids').split(',')]
		layers = models.WMSOverlay.objects.filter(id__in=layer_ids)
	
	scans, scan_ids = [], []
	if r.get('scan_ids') is not None and len(r.get('scan_ids')) > 0:
		scan_ids = [n for n in r.get('scan_ids').split(',')]
		scans = models.Scan.objects.select_related('source_print').filter(id__in=scan_ids).to_dict_list()
				 
	layouts = models.Layout.objects.filter(is_active=True).order_by('id',)
	layout_id = int(r.get('layout', 1))
	layout = models.Layout.objects.get(id=layout_id)
	zoom = int(r.get('zoom', 17))
	profile = models.UserProfile.objects.get(user=request.user)
	
	#set lat / lng (including defaults, if not defined any other way):
	center_lat,center_lng = 55.16, 61.4
	if profile.default_location is not None:
		center_lat = profile.default_location.y
		center_lng = profile.default_location.x
	center_lat = float(r.get('center_lat', center_lat))
	center_lng = float(r.get('center_lng', center_lng))
	center = Point(center_lng, center_lat, srid=4326)
	
	map_title = r.get('map_title', None)
	instructions = r.get('instructions', None)
	if instructions is not None: #preserve line breaks in the pdf report
		instructions = '<br/>'.join(instructions.splitlines())
	
	extras = {}
	
	has_extra_form_page = layout.is_data_entry and r.get('long_form') is not None and \
			form is not None
	
	if r.get('generate_pdf') is not None:
		p = models.Print.generate_print(
				request.user,
				project,
				layout,
				map_provider,
				zoom,
				center,
				request.get_host(),
				map_title=r.get('map_title'),
				instructions=r.get('instructions'),
				form=form,
				layer_ids=None,
				scan_ids=scan_ids,
				has_extra_form_page=has_extra_form_page
			)

		extras.update({
			'map': p.thumb(),
			'pdf': p.pdf()
		})
		
	extras.update({
		'embed': embed,
		'base_template': base_template,
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
		'forms': json.dumps([f.to_dict() for f in forms]),
		'selected_project': project
	})
	if form is not None:
		extras.update({'form': json.dumps(form.to_dict())})
	return render_to_response(template_name, extras,
							  context_instance = RequestContext( request))
	
