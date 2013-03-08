from localground.apps.prints.models import Print
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.contrib.auth.models import User
from localground.apps.helpers.api.decorators import process_identity
import json

@require_http_methods(["GET"])
@process_identity  
def get_print(request, print_id=None, identity=None):
    '''
    Description:
        This method is requested both by the batch script and by the "My Prints"
        section.  Need to handle authentication better.
    Parameters (from request.GET):
        print_id:               8-digit print_pk
        include_print_users:    if true, to_dict queries for list of users who
                                have specific permissions on that print
        include_map_groups:     if true, to_dict queries all the groups to which the
                                print belongs
        include_processed_maps: Also return a list of processed maps (if applicable)
        include_markers:        Also return a list of markers
        alias:                  Admins only:  allows you to pretend you're someone else
    '''
    try:
        if request.GET.get('print_id') is None and print_id is None:
            return HttpResponse(json.dumps({
                'code': 'error',
                'message': 'No arguments provided'
            }))
        print_id = print_id or request.GET.get('print_id')
        include_print_users = (request.GET.get('include_print_users', 'false') in ['True', 'true', '1'])
        include_map_groups = (request.GET.get('include_map_groups', 'false') in ['True', 'true', '1'])
        include_processed_maps = (request.GET.get('include_processed_maps', 'false') in ['True', 'true', '1'])
        include_markers = (request.GET.get('include_markers', 'false') in ['True', 'true', '1'])
        
        print_rec = Print.objects.get(id=print_id)
        
        user = identity
        
        #check authorization:
        if not print_rec.can_view(user):
            return HttpResponse(json.dumps({
                'code': 'error',
                'message': 'Not authorized to view Print #' + print_id,
                'request_parameters': request.GET
            }), status=401)
    
    except Print.DoesNotExist:
        return HttpResponse(json.dumps({
                'code': 'error',
                'message': 'No record exists for Print #' + print_id,
                'request_parameters': request.GET
            }))
    print_dict = print_rec.to_dict(include_print_users=include_print_users,
                                  include_map_groups=include_map_groups,
                                  include_processed_maps=include_processed_maps,
                                  include_markers=include_markers)
    print_dict.update({
        'code': 'success',
        'request_parameters': request.GET,
        'can_view': print_rec.can_view(user),
        'can_edit': print_rec.can_edit(user),
        'can_manage': print_rec.can_manage(user),
    })
    return HttpResponse(json.dumps(print_dict))



@require_http_methods(["GET"])
@process_identity
def get_user_prints(request, identity=None):
    r = request.GET
    include_shared = (r.get('include_shared', 'false') in ['True', 'true', '1'])
    has_processed_images = (r.get('has_processed_images', 'false') in ['True', 'true', '1'])
    can_edit = (r.get('can_edit', 'false') in ['True', 'true', '1'])
    can_manage = (r.get('can_manage', 'false') in ['True', 'true', '1'])
    request_flags = r
    user = identity
    prints = (Print.objects
              .my_prints(
                    user, include_shared=include_shared, can_manage=can_manage,
                    with_scans=has_processed_images, can_edit=can_edit)
              .to_dict_list(include_scan_counts=True))

    '''
    #for testing:
    from django.shortcuts import render_to_response
    from django.template import RequestContext 
    return render_to_response('base/api_tester.html', {'prints': prints})
    '''
    return HttpResponse(json.dumps({
        'code': 'success',
        'count': len(prints),
        'prints': prints,
        'request_parameters': r
    }))
    
def get_prints_autocomplete(request):
    try:
        q = request.GET.get('q')
        limit = int(request.GET.get('limit', '10'))
        if q is not None:
            prints = list(Print.objects.filter(deleted=False)
                      .filter(id__icontains=q)
                      .values_list('id', flat=True).order_by('id',)[:limit])
        else:
            prints = list(Print.objects.filter(user=request.user)
                      .values_list('id', flat=True).order_by('id',)[:limit])    
    except Print.DoesNotExist:
        return HttpResponse('', mimetype='text/plain')
    return HttpResponse('\n'.join(prints), mimetype='text/plain')
    
def set_access_control_headers(response):
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response['Access-Control-Max-Age'] = 1000
    response['Access-Control-Allow-Headers'] = '*'
    
def get_air_quality_data(request, form_id):
    from localground.apps.prints.models import Form
    from django.contrib.gis.geos import GEOSGeometry
    
    r = request.GET
    col_4_val = r.get('col_4', '07-12-12 @ 03:36 PM')
    
    form = Form.objects.get(id=int(form_id))
    objects = (form.TableModel.objects.values('col_1', 'col_3', 'point')
                        .filter(col_4=col_4_val).order_by('col_1',))
    
    def to_dict(rec):
        d =  dict(fields=[
                rec.get('col_1').strftime('%m/%d/%Y, %I:%M:%S %p'),
                rec.get('col_3')
            ]) 
        if rec.get('point') is not None:
            point = GEOSGeometry(rec.get('point'))
            d.update(dict(lat=point.y, lng=point.x))
        return d
    
    recs = [to_dict(o) for o in list(objects)]
    json.encoder.FLOAT_REPR = lambda f: '%.5f' % f
    response = HttpResponse(json.dumps({
        'code': 'success',
        'count': len(recs),
        'records': recs,
        'request_parameters': r
    }))
    set_access_control_headers(response)
    return response
    
def get_table_data(request, form_id):
    from localground.apps.prints.models import Form
    if form_id == '84':
        return get_air_quality_data(request, form_id)
    
    form = Form.objects.get(id=int(form_id))
    include_attachment = False
    if form_id == '92':
        include_attachment = True
        
    objects = form.get_data(is_blank=False, to_dict=True, include_markers=False,
                                manually_reviewed=True,
                                include_attachment=include_attachment,
                                order_by=['snippet__source_attachment__name',
                                         'time_stamp'])
    if form_id == '92':
        for i, obj in enumerate(objects):
            attribution =  objects[i]['attachment']['attribution']
            attachment =  objects[i]['attachment']['name']
            name = objects[i].get('name', '#' + str(objects[i].get('id')))
            objects[i]['name'] = '%s - %s %s' % (attribution, attachment, name)
    
    json.encoder.FLOAT_REPR = lambda f: '%.5f' % f
    response = HttpResponse(json.dumps({
        'code': 'success',
        'count': len(objects),
        'records': objects
    }))
    set_access_control_headers(response)
    return response
    
def get_menu(request, form_id):
    '''
    Used as a grouping function for the EBAYS data:
    select distinct col_4, max(col_1) 
    from table_vanwars_xgb5qaw826 
    group by col_4
    order by max(col_1) desc;
    '''
    from localground.prints.models import Form
    from django.db.models import Max
    form = Form.objects.get(id=int(form_id))
    recs = (form.TableModel.objects.distinct().values('col_4')
                .annotate(time_max=Max('col_1')).order_by('-time_max',))

    response = HttpResponse(json.dumps({
        'code': 'success',
        'count': len(recs),
        'file_names': [rec['col_4'] for rec in recs]
    }))
    set_access_control_headers(response)
    return response
    
