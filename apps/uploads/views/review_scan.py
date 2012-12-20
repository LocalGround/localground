from django.shortcuts import render_to_response
from localground.apps.uploads.models import *
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.template import RequestContext
import simplejson as json
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt


def process_snippets(request, scan_id=None):
    c = RequestContext(request)
    c.update(csrf(request))
    #todo:  implement permissions!
    if scan_id is not None:
        scan = Scan.objects.get(uuid=scan_id)
        #if scan.user is None or scan.user == request.user or request.user.is_superuser():
        c.update({
            'scans': [scan],
            'selected_id': scan_id
        })
    else:
        c.update({ 'scans': Scan.objects.failed_scans(user=request.user) })
    return render_to_response('process_snippets.html', c)
    
def delete_review(request, review_id):
    from localground.apps.uploads.models import Review
    review = Review.objects.get(id=review_id)
    marker = review.source_marker
    review.delete()
    return HttpResponse(json.dumps(marker.to_dict()))

def match_scans_to_snippets(request, scan_id=None):
    from localground.apps.prints.models import Print
    c = RequestContext(request)
    c.update(csrf(request))
    attachments = Attachment.objects.all().order_by('name',) #.filter(source_scan__isnull=True)
    attachments = [a.to_dict() for a in attachments]       
    c.update({
        'prints': Print.objects.get_prints_with_scans(),
        'attachments': json.dumps(attachments)
    })
    return render_to_response('match.html', c)
    
def add_attachment_to_scan(request):
    r = request.GET or request.POST
    scanID = r.get('scanID')
    a = Attachment.objects.get(id=int(r.get('attachmentID')))
    a.source_scan = Scan.objects.get(uuid=scanID)
    a.source_print =  a.source_scan.source_print
    a.save()
    return HttpResponse(json.dumps({'message': 'saved'}))

def get_scans_by_print(request, print_id):
    r = request.GET or request.POST
    unmatched = r.get('unmatched', False)
    scans = (Scan.objects.filter(source_print__id=print_id)
            .exclude(deleted=True).order_by('name', 'id'))
            
    

    attachments = Attachment.objects.filter(source_scan__in=scans).values_list('source_scan__id', 'id')
    returnObj = []
    for s in scans:
        e = {
            'id': s.id,
            'name': s.name,
            'file_name': s.file_name,
            'thumbnail_name' : s.thumbnail_name,
            'attachments': []
        }
        for a in attachments:
            if a[0] == s.id: e['attachments'].append(str(a[1]))
        
        #check to see if attachment is required before appending:
        if unmatched:
            if len(e['attachments']) == 0:
                returnObj.append(e)
        else:
            returnObj.append(e)

    return HttpResponse(json.dumps(returnObj))
    
    
@csrf_exempt   
def review_scan(request, scan_id=None):
    c = RequestContext(request)
    c.update(csrf(request))
    #todo:  implement permissions!
    if scan_id is not None:
        scan = Scan.objects.get(uuid=scan_id)
        #if scan.user is None or scan.user == request.user or request.user.is_superuser():
        c.update({
            'scans': [scan],
            'selected_id': scan_id
        })
    else:
        c.update({ 'scans': Scan.objects.failed_scans(user=request.user) })
    return render_to_response('review_scans.html', c)
    
@csrf_exempt   
def get_scan(request, scan_id):
    map_rect, scan_rect, qr_code = None, None, None
    scan = Scan.objects.get(uuid=scan_id)
    qr_rect, map_rect, success, message = scale_rectangles(scan, direction='down') #function handles null values
    if not success:
        return HttpResponse(json.dumps({'error': message }))
    d = {
        'id': scan.id,
        'file_name': scan.file_name,
        #'message': str(scan.status.id) + ") " + scan.status.name + ": " + scan.status.description,
        'message':  scan.status.description,
        'message_id': scan.status.id
    }
    if qr_rect is not None:
        d.update({'qr_rect': qr_rect})
    if map_rect is not None:
        d.update({'map_rect': map_rect})
    if scan.qr_code is not None and len(scan.qr_code) == 8:
        d.update({'qr_code': scan.qr_code})
        
    return HttpResponse(json.dumps(d))

def scale_rectangles(scan, qr_rect=None, map_rect=None, direction='up'):
    import Image
    orig_path = settings.USER_MEDIA_ROOT + "/scans/" + scan.id + "/" + scan.file_name
    thumb_path = settings.USER_MEDIA_ROOT + "/scans/" + scan.id + "/" + scan.id + "_thumb.png"
    try:
        orig = Image.open(orig_path)
        thumb = Image.open(thumb_path)
        if direction=='up':
            ratio = (1.0*orig.size[0])/thumb.size[0]
        else:
            ratio = (1.0*thumb.size[0])/orig.size[0]
        #if (scan.qr_rect is not None and len(scan.qr_rect) > 10) or \
        #    (scan.map_rect is not None and len(scan.map_rect) > 10):
                
        if qr_rect is None and scan.qr_rect is not None and len(scan.qr_rect) > 5:
            qr_rect = scan.qr_rect
        if map_rect is None and scan.map_rect is not None and len(scan.map_rect) > 5:
            map_rect = scan.map_rect
            
        #scale rectangle to original size:
        if map_rect is not None:
            map_rect = json.loads(map_rect)
            for n in map_rect:
                n['x'] = int(n['x']*ratio)
                n['y'] = int(n['y']*ratio)
            map_rect = json.dumps(map_rect)
        
        if qr_rect is not None:
            qr_rect = json.loads(qr_rect)
            for n in qr_rect:
                n['x'] = int(n['x']*ratio)
                n['y'] = int(n['y']*ratio)
            qr_rect = json.dumps(qr_rect)
        
        return qr_rect, map_rect, True, ''
    except IOError:
        return None, None, False, 'Map image directory not found: /static/scans/' + scan.id + '/'
        



@csrf_exempt
def save_manual_edits(request, scan_id):
    #import Image
    map_rect = request.GET.get('mapRect')
    qr_rect = request.GET.get('qrRect')
    qr_code = request.GET.get('qrCode')
    scan = Scan.objects.get(uuid=scan_id)
    
    # scale the rectangles to the image's original size (right now the (x,y) pairs
    # are relative to the thumbnail.
    qr_rect, map_rect, success, message = scale_rectangles(scan, qr_rect=qr_rect, map_rect=map_rect)
    if not success:
        return HttpResponse(message)
    
    
    scan.status = StatusCode.objects.get(id=1) #start again
    scan.map_rect = map_rect
    scan.qr_rect = qr_rect
    if qr_code is not None and len(qr_code) == 8:
        scan.qr_code = qr_code
    scan.save()
    
    # 1) delete associated markers:
    PointOverlay.objects.filter(scan=scan).delete()
    # 2) delete associated messages:
    ProcessingMessage.objects.filter(scan=scan).delete()
    
    scans_in_queue = Scan.objects.scans_in_queue()
    i = 0
    for q in scans_in_queue:
        i = i+1
        if q.id == scan.id:
            break
        
    return HttpResponse(json.dumps(
        {
            'mapRect': map_rect,
            'qrRect': qr_rect,
            'qrCode': qr_code,
            'num_in_queue': i,
            'scans_in_queue': len(Scan.objects.scans_in_queue()),
            'url': '/viewer/?scanID=' + scan.id
        }
    ))
        

    
   


    



