from django import test
from localground.apps.site.views import profile
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin
from rest_framework import status
import urllib

class PrintProfileTest(test.TestCase, ViewMixin):

    def setUp(self):
        ViewMixin.setUp(self)
        self.urls = ['/profile/prints/']
        self.view = profile.object_list_form
