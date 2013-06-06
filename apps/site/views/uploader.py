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


@process_project  
@login_required
def init_upload_form(request,
                     media_type='photos',
                 template_name='forms/uploader.html',
                 base_template='base/base.html',
                 embed=False, identity=None, project=None):
    username = identity.username if identity is not None else 'all'
    projects = Project.objects.get_objects(identity)
    if request.user.is_superuser and username == 'all':
        projects = Project.objects.all().order_by('name')
    project_id = 'all'
    media_types = [
        ('photos', 'Photos', 'png, jpg, jpeg, gif'),
        ('audio-files', 'Audio Files', 'audio/x-m4a, m4a, mp3, m4a, mp4, mpeg'),
        ('maps', 'Paper Maps & Forms', 'png, jpg, jpeg, gif'),
        ('air-quality', 'DustTrak Data', 'log (GPS) + csv (DustTrak)'),
        ('odk', 'ODK Data', 'zipped ODK form instance'),
    ]
    selected_media_type = (None, 'Error')
    for mt in media_types:
        if mt[0] == media_type: selected_media_type = mt
    if project is not None: project_id = str(project.id)
    extras = {
        'media_types': media_types,
        'selected_media_type': selected_media_type,
        'embed': embed,
        'base_template': base_template,
        'projects': projects,
        'selected_project': project,
        'selected_project_id': project_id
    }
    return render_to_response(template_name, extras,
                              context_instance = RequestContext( request))


@process_project 
@login_required
def upload_media(request, project=None):
    if request.method == 'POST':
        new_object, message = None, None
        file = request.FILES.get('files[]')
        media_type = request.POST.get('media_type')
        success, error_message = True, None
        try: 
            #branch processing based on upload type:
            if media_type == 'photos':
                new_object = Photo()
                new_object.save_upload(file, request.user, project)
            elif media_type == 'audio-files':
                new_object = Audio()
                new_object.save_upload(file, request.user, project)
            elif media_type == 'maps':
                new_object = Scan()
                new_object.save_upload(file, request.user, project)
            else:
                success = False
                error_message = 'Unknown file type'
        except:
            import sys
            success = False
            error_message = str(sys.exc_info()[1])
            
        if success:
            responseObj = {
                'fileName': new_object.file_name_orig,
                'user': request.user.username,
                'content_type': new_object.content_type,
                'time_created': datetime.now().strftime('%m/%d/%Y, %I:%M %p'),
                'update_url': '/profile/%s/?project_id=%s' % \
                                    (new_object.get_object_type(), project.id),
                'delete_url': '/profile/%s/delete/%s/' % \
                            (new_object.get_object_type(), new_object.id),
                'success': True
            }
        else:
            responseObj = {
                'error_message': error_message,
                'success': False,
                'media_type': media_type
            }
            if project is not None:
                responseObj['project_id'] = project.id
        return HttpResponse(json.dumps(responseObj))
    else:
        return HttpResponse(json.dumps(dict(message='Not a post')))
