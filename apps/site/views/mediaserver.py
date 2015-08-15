#!/usr/bin/env python
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound
from django.conf import settings
import base64
from datetime import datetime

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
    relative_image_path = base64.b64decode(hash)
    relative_image_paths = relative_image_path.split('#')
    relative_image_path = relative_image_paths[0]
    timestamp = relative_image_paths[1]
    # return HttpResponse(relative_image_path)
    if can_view is False:
        return HttpResponseNotFound()
    else:
        response = HttpResponse()
        media_path = '%s%s' % (settings.FILE_ROOT, relative_image_path)
        response['X-Sendfile'] = media_path
        #response['Expires'] = datetime.now()
        #response['Cache-Control'] = 'public,max-age=1'
        if object_type in ['photos', 'snippets', 'attachments', 'map-images']:
            content_type = 'image/%s' % \
                (relative_image_path.split('.')[-1]).replace('jpg', 'jpeg')
        elif object_type.find('audio') != -1:
            content_type = 'audio/mpeg3'
        elif object_type == 'videos':
            content_type = 'application/octet-stream'
        else:
            content_type = 'application/octet-stream'
        response['Content-Type'] = content_type
        response['Content-Disposition'] = 'attachment; filename="%s/your_media_%s.%s"' % \
            (object_type, timestamp, relative_image_path.split('.')[-1])
        return response
