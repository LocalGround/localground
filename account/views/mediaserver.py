#!/usr/bin/env python
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound
from django.conf import settings
import os
import base64

# sudo apt-get install libapache2-mod-xsendfile
# http://localground/profile/<plural-object-type>/<the-hash>/
def serve_media(request, object_type, hash):
    """
    Uses Apache's libapache2-mod-xsendfile module to read a base64 encoded
    relative media path and serve out the corresponding media file.  More
    discussion needed on the best way to serve secure static media without the
    overhead of repetitive database queries.
    """
    can_view = True
    relative_image_path = base64.b64decode(hash) #'media/vw/photos/car.png'
    #return HttpResponse(relative_image_path)
    if can_view is False:
        return HttpResponseNotFound()
    else:
        response = HttpResponse()
        media_path = '%s%s' % (settings.FILE_ROOT, relative_image_path)
        response['X-Sendfile'] = media_path
        if object_type in ['photos', 'snippets', 'attachments', 'map-images']:
            content_type = 'image/%s' % \
                    (relative_image_path.split('.')[-1]).replace('jpg', 'jpeg')
        elif object_type == 'audio-files':
            content_type = 'audio/mpeg3'
        elif object_type == 'videos':
            content_type = 'application/octet-stream'
        else:
            content_type = 'application/octet-stream'
        response['Content-Type'] = content_type
        response['Content-Disposition'] = 'attachment; filename="%s/%s"' % \
            (object_type, relative_image_path.split('/')[-1])
        return response

