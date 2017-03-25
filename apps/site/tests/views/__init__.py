'''
from localground.apps.site.tests.views.print_tests import *
from localground.apps.site.tests.views.forms import *
from localground.apps.site.tests.views.map_tests import *
from localground.apps.site.tests.views.profile_tests import *
from localground.apps.site.tests.views.sharing_tests import *
from localground.apps.site.tests.views.upload_tests import *
'''
from django import test
from django.shortcuts import render
from localground.apps.site.views import maps
from localground.apps.site.tests import ViewMixin, ViewAnonymousMixin
from rest_framework import status

class GenericTests(test.TestCase, ViewAnonymousMixin):

    def setUp(self):
        ViewAnonymousMixin.setUp(self)
        self.urls = [
            '/map/', '/table/', '/gallery/', '/presentation/', '/'
        ]
        self.view = render
        
    def test_anonymous_raises_302_redirect_on_protected_pages(self, urls=None):
        for url in ['/map/', '/table/', '/gallery/']:
            response = self.client_anonymous.get(url)
            self.assertEqual(response.status_code, status.HTTP_302_FOUND)
    
    def test_logged_in_user_returns_200_on_protected_pages(self, urls=None):
        for url in ['/map/', '/table/', '/gallery/']:
            response = self.client_user.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_anonymous_shows_200_on_public_pages(self, urls=None):
        for url in ['/', '/presentation/']:
            response = self.client_anonymous.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)