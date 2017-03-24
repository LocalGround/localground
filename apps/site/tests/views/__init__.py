'''
from localground.apps.site.tests.views.print_tests import *
from localground.apps.site.tests.views.forms import *
from localground.apps.site.tests.views.map_tests import *
from localground.apps.site.tests.views.profile_tests import *
from localground.apps.site.tests.views.sharing_tests import *
from localground.apps.site.tests.views.upload_tests import *
'''
from django import test
from localground.apps.site.views import maps
from localground.apps.site.tests import ViewMixin, ViewAnonymousMixin
from rest_framework import status

class GenericTests(test.TestCase, ViewAnonymousMixin):

    def setUp(self):
        ViewAnonymousMixin.setUp(self)
        self.urls = [
            '/map/', '/table/', '/gallery/', '/presentation/'
        ]
        
    def test_anonymous_raises_404_on_protected_pages(self, urls=None):
        for url in ['/map/', '/table/', '/gallery/']:
            response = self.client_anonymous.get(url)
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)