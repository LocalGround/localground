from django import test
from localground.apps.site.views import uploader
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin
from rest_framework import status
import urllib

class UploadTest(test.TestCase, ViewMixin):
    '''
    Loads Django template
    '''
    def setUp(self):
        ViewMixin.setUp(self)
        self.urls = [
            '/upload/',
            '/upload/photos/',
            '/upload/audio/',
            '/upload/map-images/',
            '/upload/embed/',
            '/upload/photos/embed/',
            '/upload/audio/embed/',
            '/upload/map-images/embed/'
        ]
        self.view = uploader.init_upload_form
        
class UploadMediaTest(test.TestCase, ViewMixin):
    '''
    Handles file uploads. Todo: migrate to use the API Endpoints
    '''
    def setUp(self):
        ViewMixin.setUp(self)
        self.urls = ['/upload/media/post/']
        self.view = uploader.upload_media
