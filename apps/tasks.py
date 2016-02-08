from celery import Celery
from django.conf import settings
import os

#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
app = Celery('tasks', backend='rpc://guest@localhost//', broker='amqp://guest@localhost//')
#app = Celery('tasks', backend='djcelery.backends.database:DatabaseBackend', broker='amqp://guest@localhost//')
#app.conf.update(
#    CELERY_RESULT_BACKEND='djcelery.backends.database:DatabaseBackend',
#)

@app.task(name='localground.apps.tasks.add')
def add(x, y):
    return x + y
