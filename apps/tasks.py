from celery import Celery
from django.conf import settings
import os, sys

cwd = os.path.dirname(os.path.realpath(__file__))
apps = os.path.dirname(cwd)
workspace = os.path.dirname(apps)
sys.path.append(workspace) 

#import localground.apps.settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'localground.apps.settings')
#app = Celery('tasks', backend='rpc://guest@localhost//', broker='amqp://guest@localhost//')
app = Celery('tasks', backend='djcelery.backends.database:DatabaseBackend', broker='amqp://guest@localhost//')
#app.conf.update(
#    CELERY_RESULT_BACKEND='djcelery.backends.database:DatabaseBackend',
#)


@app.task(name='localground.apps.tasks.process_map')
def process_map(map):
	return map.process()