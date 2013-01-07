from django.shortcuts import render_to_response
from localground.apps.site.models import *
from localground.apps.helpers import generic
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from localground.apps.site.decorators import process_identity, process_project
from django.conf import settings
from django.template import RequestContext
import simplejson as json
from localground.apps.site.models import Project
from datetime import datetime


'''from django.core.context_processors import csrf
try:
    # django SVN
    from django.views.decorators.csrf import csrf_exempt
except:
    # django 1.1
    from django.contrib.csrf.middleware import csrf_exempt'''

@login_required()
@process_identity
@process_project 
def init_upload_form(request,
                 template_name='forms/uploader.html',
                 base_template='base/base.html',
                 embed=False, identity=None, project=None):
    username = identity.username if identity is not None else 'all'
    projects = Project.objects.get_objects(identity)
    if request.user.is_superuser and username == 'all':
        projects = Project.objects.all().order_by('name')
    project_id = 'all'
    if project is not None: project_id = str(project.id)
    extras = {
        'embed': embed,
        'base_template': base_template,
        'projects': projects,
        'selected_project': project,
        'selected_project_id': project_id
    }
    return render_to_response(template_name, extras,
                              context_instance = RequestContext( request))


#@csrf_exempt   
def upload(request):
    import os
    from datetime import datetime
    
    if request.method == 'POST':
        # 1) Write the file to disk:
        uuID            = generic.generateID()
        f               = request.FILES['Filedata']  #use uploadify when debugging, Filedata otherwise
        file_name       = ''.join(f.name.split(' ')) #removes spaces
        path            = settings.USER_MEDIA_ROOT + '/scans/' + uuID
        os.mkdir(path)
        os.chmod(path, 775)
        destination     = open(path + '/' + file_name, 'wb+')
        for chunk in f.chunks():
            destination.write(chunk)
        destination.close()
        
        # 2) Insert to the database:
        scan                    = Scan()
        scan.status             = StatusCode.objects.get(id=1)
        scan.upload_source      = UploadSource.objects.get(id=1)
        scan.id                 = uuID
        scan.file_name          = file_name
        scan.name               = request.POST.get('scanName') or request.POST.get('name')
        
        if 'description' in request.POST:
            scan.description    = request.POST.get('description')
        
        #for email input:
        if 'email' in request.POST:
            scan.upload_source  = UploadSource.objects.get(id=2)
            scan.email_sender   = request.POST.get('email')
            if 'body' in request.POST:
                scan.email_body = request.POST.get('body')
            if 'subject' in request.POST:
                scan.email_subject= request.POST.get('subject')
            
        if not request.user.is_anonymous(): 
            scan.user           = request.user
        
        content_type_arr        = file_name.split('.')
        content_type            = content_type_arr[len(content_type_arr)-1]
        scan.content_type       = content_type.lower()
        scan.save()
        
        
        # determine how many scans are in the queue and how long it will take to
        # process everything
        scans_in_queue = Scan.objects.scans_in_queue()
        i = 0
        for q in scans_in_queue:
            i = i+1
            if q.id == scan.id:
                break
        
        responseObj = {
            'scanID': uuID,
            'fileName': file_name,
            'name': request.POST.get('scanName') or request.POST.get('name'),
            'user': request.user.is_anonymous(),
            'content_type': content_type,
            'time_created': datetime.now().strftime('%m/%d/%Y, %I:%M %p'),
            #'url': '/static/scans/' + uuID + '/' + file_name,
            'num_in_queue': i,
            'scans_in_queue': len(Scan.objects.scans_in_queue()),
            'url': '/viewer/?scanID=' + scan.id,
            'description': request.POST.get('description', '')
        }  
        return HttpResponse(json.dumps(responseObj))
    else:
        return HttpResponse(json.dumps(dict(message='Not a post')))
        
    


@login_required()
def init_media_form(request):
    from localground.apps.site.models import Print
    c = RequestContext(request)
    c.update(csrf(request))
    c.update({
        'action': '/upload/media/post/',
        'media_types': UploadType.objects.exclude(name='map'),
        'is_media_form': True,
        'prints': Print.objects.get_my_prints(request.user)
    })
    return render_to_response('upload.html', c)




#@csrf_exempt
@process_project 
@process_identity
@login_required()
def upload_media(request, identity=None,  project=None):
    if request.method == 'POST':
        new_object, message = None, None
        #branch processing based on upload type:
        media_type = UploadType.objects.get(id=int(request.POST.get('media_type')))
        file = request.FILES.get('files[]')   
        if media_type.name == 'photo':
            new_object = Photo()
            new_object.save_upload(file, identity, project)
        elif media_type.name == 'audio':
            new_object = Audio()
            new_object.save_upload(file, identity, project)
        elif media_type.name in ['map', 'attachment']:
            new_object = Scan()
            new_object.save_upload(file, identity, project)
            
        responseObj = {
            'fileName': new_object.file_name_orig,
            'user': identity.username,
            'content_type': new_object.content_type,
            'time_created': datetime.now().strftime('%m/%d/%Y, %I:%M %p'),
            'update_url': '/profile/%s/?project_id=%s' % \
                                (new_object.get_object_type(), project.id),
            'delete_url': '/profile/%s/delete/%s/' % \
                        (new_object.get_object_type(), new_object.id)
        }
        return HttpResponse(json.dumps(responseObj))
    else:
        return HttpResponse(json.dumps(dict(message='Not a post')))
    '''except:
        #return HttpResponse(json.dumps(dict(message='Error')))
        result = []
        filename, file_size, file_url, thumb_url, file_delete_url = '123','123','123','123','123' 
        result.append({"name":filename, 
                       "size":file_size, 
                       "url":file_url, 
                       "thumbnail_url":thumb_url,
                       "delete_url":file_delete_url + '/', 
                       "delete_type":"POST",})
        return HttpResponse(json.dumps(result))'''
