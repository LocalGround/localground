from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from django.contrib.gis.geos import GEOSGeometry

class APIMarkerWAttrsListTest(test.TestCase, ViewMixinAPI):
    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.view = views.MarkerWAttrsList.as_view()
        #self.metadata = get_metadata()
        self.markerwattrs = self.create_marker_w_attrs(self.user, self.project)
        self.urls = ['/api/0/forms/%s/data/%s/' % (self.project.id, self.markerwattrs.id)]

    #def tearDown(self):
        # delete method also removes files from file system:
        # models.Photo.objects.all().delete()
        # models.Audio.objects.all().delete()

    def test_something(self):
        self.assertAlmostEqual(1, 1)