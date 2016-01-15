from django.shortcuts import render_to_response
from localground.apps.site.models import *
from localground.apps.lib.helpers import generic
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from localground.apps.site.decorators import process_identity, process_project
from django.conf import settings
from django.template import RequestContext
import simplejson as json
from localground.apps.site.models import Project
from datetime import datetime


@login_required
@process_project
def init_upload_form(request,
                     media_type='photos',
                     template_name='forms/uploader.html',
                     base_template='base/base.html',
                     embed=False, project=None):
    if embed:
        base_template = 'base/iframe.html'

    projects = Project.objects.get_objects(request.user)
    media_types = [
        ('photos',
         'Photos',
         'png, jpg, jpeg, gif'),
        ('audio',
         'Audio Files',
         'audio\/x-m4a, m4a, mp3, m4a, mp4, mpeg, video\/3gpp, 3gp, aif, aiff, ogg, wav'),
        ('map-images',
         'Paper Maps / Forms',
         'png, jpg, jpeg, gif')
    ]
    selected_media_type = (None, 'Error')
    for mt in media_types:
        if mt[0] == media_type:
            selected_media_type = mt
    extras = {
        'media_types': media_types,
        'selected_media_type': selected_media_type,
        'embed': embed,
        'base_template': base_template,
        'projects': projects,
        'selected_project': project,
        'selected_project_id': project.id
    }
    return render_to_response(template_name, extras,
                              context_instance=RequestContext(request))
