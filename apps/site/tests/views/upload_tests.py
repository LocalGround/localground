from django import test
from localground.apps.site.views import uploader
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin
from rest_framework import status
import urllib

class InitUploadFormTest(test.TestCase, ViewMixin):
    '''
    Loads Django template
    '''
    def setUp(self):
        ViewMixin.setUp(self)
        self.urls = [
            '/upload/',
            '/upload/map-images/',
            '/upload/embed/',
            '/upload/map-images/embed/'
        ]
        self.view = uploader.init_upload_form