"""
WSGI config for firstsite project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os
import sys
cwd = os.path.dirname(os.path.realpath(__file__))
apps = os.path.dirname(cwd)
workspace = os.path.dirname(apps)

sys.path.append(workspace)
import localground.apps.settings

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "localground.apps.settings")

application = get_wsgi_application()
