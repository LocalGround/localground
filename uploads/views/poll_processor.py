from django.shortcuts import render_to_response, get_object_or_404
from localground.uploads.models import *
from localground import globals
#from django.conf.urls.defaults import *
from django.contrib.gis.geos import *
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.template import RequestContext
import simplejson as json
from django.core.context_processors import csrf
try:
    # django SVN
    from django.views.decorators.csrf import csrf_exempt
except:
    # django 1.1
    from django.contrib.csrf.middleware import csrf_exempt
    
@csrf_exempt   
def get_next_scan(request):
    scans   = Scan.objects.filter(deleted=False).filter(status=1).order_by('time_stamp')[:1]
    if len(scans) > 0:
        return HttpResponse(
            json.dumps({
                "id": scans[0].id,
                "url": settings.SERVER_URL + '/static/scans/' + scans[0].id + '/' + scans[0].file_name,
                "fileName": scans[0].file_name
            })
        )
    else:
        return HttpResponse(json.dumps({ "id": None, "url": None, "fileName": None }))
   
   

@csrf_exempt   
def get_scan_config(request):
    scan_id = request.POST.get('scanID')
    if scan_id is None:
        scan_id = request.GET.get('scanID')
    scan = Scan.objects.get(uuid=scan_id)
    
    #only populate if not not null or blank:
    qr_code, map_rect, qr_rect = None, None, None
    if scan.qr_code is not None and len(scan.qr_code) == 8:
        qr_code = scan.qr_code
    if scan.map_rect is not None and len(scan.map_rect) > 20:
        map_rect = json.loads(scan.map_rect)
    if scan.qr_rect is not None and len(scan.qr_rect) > 20:
        qr_rect = json.loads(scan.qr_rect)
    
    d = {
        'id': scan.id, 
        'map_rect': map_rect,
        'qr_rect': qr_rect,
        'qr_code': qr_code
    }
    return HttpResponse(json.dumps(d))
         

@csrf_exempt   
def record_error(request):
    scan_id = request.POST.get('scanID')
    error_code = request.POST.get('error_code')
    
    if scan_id == None:
        scan_id = request.GET.get('scanID')
        error_code = request.GET.get('error_code')
    
    scan = Scan.objects.get(uuid=scan_id)
    error = ErrorCode.objects.get(id=error_code)
    message = ProcessingMessage()
    message.scan = scan
    message.error_code = error
    message.save()
    scan.status = StatusCode.objects.get(id=4) #error
    scan.save()
    return HttpResponse(True)
        

@csrf_exempt      
def post_scan_snippet(request):
    import os
    from datetime import datetime
    try:
        if request.method == 'POST':
            # 1) Write the file to disk:
            scan_id         = request.POST['scanID']
            f               = request.FILES['Filedata']  #use uploadify when debugging, Filedata otherwise
            file_name       = f.name
            path            = settings.STATIC_ROOT + '/scans/' + scan_id
            destination     = open(path + '/' + file_name, 'wb+')
            for chunk in f.chunks():
                destination.write(chunk)
            destination.close()
            return HttpResponse('From Django: ' + scan_id + ' file_name: ' + file_name)
    except Exception, e:
        return HttpResponse(e) 
    return HttpResponse(False)
    

@csrf_exempt      
def update(request):
    from localground.prints.models import Print
    from datetime import datetime
    try:
        if request.method == 'POST':
            scan_id         = request.POST['scanID']
            print_id        = request.POST['printID']
            width           = request.POST['width']
            height          = request.POST['height']
            thumb_w         = request.POST['thumb_w']
            thumb_h         = request.POST['thumb_h']
            isSuccess       = request.POST['isSuccess']

            if isSuccess == 'True' or isSuccess == True:
                isSuccess = True
            else:
                isSuccess = False
            message                 = request.POST['message']
            
            scan                    = Scan.objects.get(uuid=scan_id)
            path                = settings.STATIC_ROOT + '/scans/' + scan_id
            if isSuccess:
                #path                = settings.STATIC_ROOT + '/scans/' + scan_id
                url_root            = settings.SERVER_URL + '/static/scans/' + scan_id
                scan.status         = StatusCode.objects.get(id=2) #success
                scan.source_print   = Print.objects.get(id=print_id)
                scan.thumbnail_name = scan_id + '_thumb.png'
                source_print        = scan.source_print
                
                north               = source_print.northeast.y
                south               = source_print.southwest.y
                east                = source_print.northeast.x
                west                = source_print.southwest.x
                #make a kml file:
                kmlStr = '<?xml version="1.0" encoding="UTF-8"?>' 
                kmlStr +='<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">'
                
                #ground overlay:
                kmlStr +='<Folder>'
                kmlStr +='<GroundOverlay><name>Sample KML File for Map #' + scan_id + '</name>'
                kmlStr +='<Icon>'
                kmlStr +='<href>' + url_root + '/colorImage.png</href>'
                kmlStr +='</Icon>'
                kmlStr +='<LatLonBox>'
                kmlStr +='<north>' + str(north) + '</north>'
                kmlStr +='<south>' + str(south) + '</south>'
                kmlStr +='<east>' + str(east) + '</east>'
                kmlStr +='<west>' + str(west) + '</west>'
                kmlStr +='</LatLonBox>'
                kmlStr +='</GroundOverlay>'
                
                #markers - commented out for now:
                '''overlays = PointOverlay.objects.filter(scan=scan)
                for overlay in overlays:
                    kmlStr += '<Placemark>'
                    kmlStr += '<name>' + overlay.name + '</name>'
                    kmlStr += '<description>' + overlay.description + '<br />'
                    kmlStr += '<img src="' + url_root + '/' + overlay.snippet_image_path + '" />'
                    kmlStr += '</description>'
                    kmlStr += '<Point>'
                    kmlStr += '<coordinates>' + str(overlay.point.x) + ',' + str(overlay.point.y) + ',0</coordinates>'
                    kmlStr += '</Point>'
                    kmlStr += '</Placemark>'
                '''
                kmlStr +='</Folder>'
                kmlStr +='</kml>'
                f = open(path + '/processed_' + scan_id + '.kml', 'w')
                f.write(kmlStr)
                f.close()
                #Send email:
                if scan.email_sender and len(scan.email_sender) > 5:
                    send_mail(scan.email_sender, 2, scan_id)
            else:
                scan.status         = StatusCode.objects.get(id=4) #unreadable
                #if scan.email_sender and len(scan.email_sender) > 5:
                #    send_mail(scan.email_sender, 4, scan_id)
            scan.save()
            
            
    except Exception, e:
        return HttpResponse(e)    
        
    return HttpResponse('KML Created' + path + '/processed_' + scan_id + '.kml')
    



def send_mail(email, status, scan_id):
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    
    me              = "localground.uploads@gmail.com"
    you             = email
    # Create message container - the correct MIME type is multipart/alternative.
    msg             = MIMEMultipart('alternative')
    msg['Subject']  = "Link"
    msg['From']     = me
    msg['To']       = you
    msg['Bcc']      = 'vanwars@gmail.com,geochristy@gmail.com'
    
    
    # Create the body of the message (a plain-text and an HTML version).
    text = "Thank you for submitting your scan to Local Ground\n\n"
    if status == 2:
        text = text + "Your scan has been successfully processed.  You may view your "
        text = text + "processed scan and make changes here:\nhttp://localground.org/viewer/?scanID=" + scan_id
    else:
        text = text + "Your scan had errors.  This email message will soon provide more "
        text = text + "details about these errors."
    '''html = """\
    <html>
      <head></head>
      <body>
    
        <p>Hi!<br>
           How are you?<br>
           Here is the <a href="http://www.python.org">link</a> you wanted.
    
        </p>
      </body>
    </html>
    """'''
    
    # Record the MIME types of both parts - text/plain and text/html.
    
    part1 = MIMEText(text, 'plain')
    
    #part2 = MIMEText(html, 'html')
    
    
    # Attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in this case
    # the HTML message, is best and preferred.
    
    msg.attach(part1)
    #msg.attach(part2)
    
    
    # Send the message via local SMTP server.
    s = smtplib.SMTP('localhost')
    
    # sendmail function takes 3 arguments: sender's address, recipient's address
    # and message to send - here it is sent as one string.
    s.sendmail(me, [you,'vanwars@gmail.com','geochristy@gmail.com'], msg.as_string())
    s.quit()


@csrf_exempt      
def save_markers(request):
    return HttpResponse('Save marker no longer implemented')
    scan_id         = request.POST['scanID']
    markers_string  = request.POST['markers']
    markers         = json.loads(markers_string)
    scan            = Scan.objects.get(uuid=scan_id)
    
    '''for m in markers:
        marker                      = PointOverlay()
        marker.scan                 = scan
        marker.name                 = m['snippetHTML']
        marker.description          = '<strong>Auto-Generated Marker</strong><br />' + m['snippetHTML']
        marker.snippet_image_path   = m['snippetImgURL']
        marker.point                = GEOSGeometry('POINT(' + str(m['latLng'][0]) + ' ' + str(m['latLng'][1]) + ')')
        marker.save()
    '''
    messages        = 'scanID: ' + scan_id + ', number of markers saved: ' + str(len(markers))
    return HttpResponse(messages)