import sys
import traceback
import os
from datetime import datetime

def setup_environment():
    import os, sys
    jobs = os.path.dirname(os.path.realpath(__file__))
    lib = os.path.dirname(jobs)
    apps = os.path.dirname(lib)
    localground = os.path.dirname(apps)
    root = os.path.dirname(localground)
    sys.path.append(root)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "localground.apps.settings")
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    
if __name__ == '__main__':
    setup_environment()
    from localground.apps.site import models
    ############################
    mapimages = models.MapImage.objects.filter(status=models.StatusCode.objects.get(id=models.StatusCode.READY_FOR_PROCESSING))
    if len(mapimages) > 0:
        # just process the top map image:
        try:
            print "Processing {0}".format(mapimages[0])
            mapimages[0].process()
        except SystemExit:
            print('There was an exception')
            traceback.print_exc()
    else:
        print "There are no map images to process"
