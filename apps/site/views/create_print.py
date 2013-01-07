from django.shortcuts import render_to_response
from localground.apps.site.decorators import process_identity, process_project
from localground.apps.site.models import Print, Layout, Form, Field, DataType
from localground.apps.helpers import generic
from localground.apps.helpers.static_maps import StaticMap
from localground.apps.helpers.reports import Report
from localground.apps.site.models import WMSOverlay, Scan, Project, UserProfile
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.conf import settings  
from django.template import RequestContext 
import simplejson as json
from django.contrib.gis.geos import Point, LinearRing, Polygon
import os, urllib, StringIO, Image, ImageDraw

@process_project
@process_identity
def generate_print(request, identity=None, is_json=False, project=None, embed=False,
                 template_name='forms/print.html', base_template='base/base.html'):
    
    r = request.GET or request.POST
    is_form_requested = r.get('short_form') is not None or \
                        r.get('long_form') is not None
    
    #initialize variables / data based on query params:
    basemap = WMSOverlay.objects.get(
                    id=int(r.get('basemap_id', settings.DEFAULT_BASEMAP_ID)))

    #get / create form (if requested):
    form = None
    if is_form_requested:
        #get existing form:
        if r.get('form_id') != '-1' and r.get('form_id') is not None:
            form = Form.objects.get(id=int(r.get('form_id', 1)))
        #create new form:
        elif r.get('form_id') == '-1':
            form = Form.create_new_form(r, request.user)
            #sql = Form.create_new_form(r, request.user)
            #return HttpResponse(sql)
    
    
    forms = Form.objects.filter(owner=identity).order_by('name',)
    layers, layer_ids = [], []
    if r.get('layer_ids') is not None and len(r.get('layer_ids')) > 0:
        layer_ids = [int(n) for n in r.get('layer_ids').split(',')]
        layers = WMSOverlay.objects.filter(id__in=layer_ids)
    
    scans, scan_ids = [], []
    if r.get('scan_ids') is not None and len(r.get('scan_ids')) > 0:
        scan_ids = [n for n in r.get('scan_ids').split(',')]
        scans = Scan.objects.select_related('source_print').filter(id__in=scan_ids)
                 
    layouts = Layout.objects.filter(is_active=True).order_by('id',)
    layout_id = int(r.get('layout', 1))
    layout = Layout.objects.get(id=layout_id)
    zoom = int(r.get('zoom', 17))
    profile = UserProfile.objects.get(user=request.user)
    
    #set lat / lng (including defaults, if not defined any other way):
    center_lat,center_lng = 55.16, 61.4
    if profile.default_location is not None:
        center_lat = profile.default_location.y
        center_lng = profile.default_location.x
    center_lat = float(r.get('center_lat', center_lat))
    center_lng = float(r.get('center_lng', center_lng))
    
    map_title = r.get('map_title', None)
    instructions = r.get('instructions', None)
    if instructions is not None: #preserve line breaks in the pdf report
        instructions = '<br/>'.join(instructions.splitlines())
    center = Point(center_lng, center_lat, srid=4326)
    
    extras = {}
    
    #get print layout (comes from database):
    map_width = layout.map_width_pixels
    map_height = layout.map_height_pixels
    qr_size = layout.qr_size_pixels
    border_width = layout.border_width #6
        
    if r.get('generate_pdf') is not None:
        
        #create directory:
        uuID        = generic.generateID()
        path        = settings.USER_MEDIA_ROOT + '/prints/' + uuID
        os.mkdir(path) #create new directory
    
        #get basemap (from Google or Cloudmade)
        m = StaticMap()
        info = m.get_basemap_and_extents(
                        basemap, zoom, center, map_width, map_height)
        map_image = info.get('map_image')
        northeast = info.get('northeast')
        southwest = info.get('southwest')
        bbox = (northeast.coords, southwest.coords)
        bbox = [element for tupl in bbox for element in tupl]
        extents = Polygon.from_bbox(bbox)
      
        overlay_image = m.get_map(layers, southwest=southwest, northeast=northeast,
                                  scans=scans, height=map_height, width=map_width,
                                  show_north_arrow=True)
        
        map_image.paste(overlay_image, (0, 0), overlay_image)
        

        if layout.is_data_entry:
            map_image = map_image.convert("L") #convert to black and white
        
        map_image.save(path + '/map.jpg')
        
        #add border around map:
        map_image = draw_border(map_image, border_width)
        map_width, map_height = map_image.size
        map_image.save(path + '/map_with_border.jpg')
        
        #make a thumbnail:
        size = map_width/3, map_height/3
        thumbnail = map_image.copy()
        thumbnail.thumbnail(size, Image.ANTIALIAS)
        thumbnail.save(path + '/thumbnail.jpg')
        
        ##################
        ## GET QR CODES ##
        ##################
        qr_image_1 = generate_qrcode(uuID, 1, path, qr_size, border_width)
        qr_image_2 = generate_qrcode(uuID, 2, path, qr_size, border_width)
        qr_size = qr_image_1.size[0]
        
        ##################
        ## Generate PDF ##
        ##################
        filename = file_name='Print_' + uuID + '.pdf'
        pdf_report = Report(
            path, file_name=filename, is_landscape=layout.is_landscape,
            author=request.user.username, title=map_title)
        
        ##########
        # Page 1 #
        ##########
        # build from the bottom up:
        #   (x & y dependencies are additive from bottom up)
        
        #add footer:
        if layout.is_data_entry:
            pdf_report.add_footer(qr_image_1, uuID, instructions)
            
        #add form:
        if layout.is_mini_form and form is not None:
            pdf_report.add_form(4, form, is_mini_form=True) 
            
        #add map:
        pdf_report.add_map(map_image, is_data_entry=layout.is_data_entry,
                           has_mini_form=layout.is_mini_form)
        
        #add header:
        pdf_report.add_header(is_data_entry=layout.is_data_entry, is_map_page=True)
        
        ##########
        # Page 2 #
        ##########
        if layout.is_data_entry and r.get('long_form') is not None and \
            form is not None:
            pdf_report.new_page()
            
            #reorient back to portrait:
            pdf_report.set_orientation(False)
            
            #add footer:
            pdf_report.add_footer(qr_image_2, uuID, instructions)
            
            #add form:
            pdf_report.add_form(13, form, is_mini_form=False) 
            
            #add header:
            pdf_report.add_header(is_data_entry=layout.is_data_entry, is_map_page=False)

        pdf_report.save()
        
        if layout.is_data_entry:
            p = Print()
            p.uuid = uuID
            p.zoom = zoom
            p.map_width = map_width
            p.map_height = map_height
            p.map_provider = basemap #provider
            p.host = request.get_host()
            p.map_image_path = 'map.jpg'
            p.pdf_path = filename
            p.preview_image_path = 'thumbnail.jpg'
            p.map_title = map_title
            p.description = instructions
            p.center = center
            p.northeast = northeast
            p.southwest = southwest
            p.owner = request.user
            p.last_updated_by = request.user
            p.extents = extents
            p.layout = layout
            p.virtual_path = p.generate_relative_path()
            if layout.is_data_entry and form is not None:
                p.form = form
                cols = form.get_fields(print_only=True)
                p.form_column_widths = ','.join([str(c.display_width) for c in cols])
                p.sorted_field_ids = ','.join([str(c.id) for c in cols])
            p.save()
            
            for l in layers:
                p.layers.add(l)
            p.projects.add(project)
            p.save()

        extras.update({
            'map': p.thumb(), #'/static/prints/' + uuID + '/thumbnail.jpg',
            'pdf': p.pdf() #'/static/prints/' + uuID + '/' + filename
        })
        
    extras.update({
        'embed': embed,
        'base_template': base_template,
        #'map_image_path': url,
        'width': map_width,
        'height': map_height,
        #'sql': get_sql(),
        'zoom': zoom,
        'center_lat': center_lat,
        'center_lng': center_lng,
        'basemap_id': basemap.id,
        'basemap_provider_id': basemap.name,
        'layer_ids': json.dumps(layer_ids),
        'layer_id_string': r.get('layer_ids'),
        'scan_id_string': r.get('scan_ids'),
        'scans': json.dumps([s.to_dict() for s in scans]),
        'layouts': json.dumps([l.to_dict() for l in layouts]),
        'selectedLayout_id': layout.id,
        'map_title': map_title,
        'instructions': instructions,
        'forms': json.dumps([f.to_dict() for f in forms]),
        'projects': Project.objects.get_objects(request.user),
        'selected_project': project
    })
    if form is not None:
        extras.update({'form': json.dumps(form.to_dict())})
    return render_to_response(template_name, extras,
                              context_instance = RequestContext( request))
 

def draw_border(img, border_width, color='black'):
    width, height = img.size
    width_new = int(width) + 2*border_width
    height_new = int(height) + 2*border_width
    img_new = Image.new('RGB', (width_new, height_new), '#FFFFFF')
    draw = ImageDraw.Draw(img_new) # Create a draw object
    draw.rectangle((0, 0, width+2*border_width, height + 2*border_width), fill=color)
    img_new.paste(img, (border_width, border_width))
    return img_new
        

def generate_qrcode(uuID, num, path, size, border_width):
    qr_url = 'http://chart.apis.google.com/chart?cht=qr&chld=Q|0'
    qr_url += '&chl=' + uuID + '_' + str(num)
    qr_url += '&chs=' + str(size) + 'x' + str(size)
    file = urllib.urlopen(qr_url)
    qr_image = StringIO.StringIO(file.read()) # constructs a StringIO holding the image
    qr_image = Image.open(qr_image).convert('RGB')
    qr_image = draw_border(qr_image, 2, color='white')
    qr_image = draw_border(qr_image, border_width)
    qr_image.save(path + '/qr_' + str(num) + '.jpg')
    return qr_image
    
