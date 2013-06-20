from localground.apps.uploads.models import *
from django.http import HttpResponse
import simplejson as json

def get_attachments(request):
    r = request.GET
    unmatched = False
    if r.get('unmatched', 'false').upper() in ['1','TRUE']:
        unmatched = True
    attachments = Attachment.objects.get_my_attachments(
                    request.user,
                    printID=r.get('printID', None),
                    unmatched=unmatched
                )
    return HttpResponse(json.dumps(attachments))
    
def get_photos(request):
    r = request.GET
    unmatched = False
    if r.get('unmatched', 'false').upper() in ['1','TRUE']:
        unmatched = True
    print_id = None
    if r.get('scanID') is not None:
        p = Scan.objects.select_related('source_print').get(id=r.get('scanID'))
        print_id = p.source_print.id
    photos = Photo.objects.get_my_photos(
                    request.user,
                    printID=print_id,
                    unmatched=unmatched
            ).to_dict_list()
    return HttpResponse(json.dumps(photos))
    
def get_audio(request):
    r = request.GET
    unmatched = False
    if r.get('unmatched', 'false').upper() in ['1','TRUE']:
        unmatched = True
    print_id = None
    if r.get('scanID') is not None:
        p = Scan.objects.select_related('source_print').get(id=r.get('scanID'))
        print_id = p.source_print.id
    audio = Audio.objects.get_my_audio(
                    request.user,
                    printID=print_id,
                    unmatched=unmatched
            )
    '''return HttpResponse(json.dumps(
        {
            'unmatched': unmatched,
            'print_id': print_id
        }))'''
    return HttpResponse(json.dumps(audio))

def get_videos(request):
    r = request.GET
    unmatched = False
    if r.get('unmatched', 'false').upper() in ['1','TRUE']:
        unmatched = True
    videos = Video.objects.get_my_videos(
                    request.user,
                    printID=r.get('printID', None),
                    unmatched=unmatched
            )
    return HttpResponse(json.dumps(videos))
    
def get_snippets(request, scan_id):
    from localground.apps.uploads.models import Snippet
    return HttpResponse(json.dumps(
            Snippet.objects.get_snippets_by_scan_id(request.user, scan_id)
        ))
    
def get_records_by_scan(request, scan_uuid):
    r = request.GET
    from localground.apps.uploads.models import Scan
    scan = Scan.objects.get(uuid=scan_uuid)
    return HttpResponse(json.dumps({'records':
        [m.to_dict() for m in scan.get_records_by_form(r.get('form_id'))]
    }))
    