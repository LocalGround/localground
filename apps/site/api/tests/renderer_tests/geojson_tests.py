import json
from django import test
from localground.apps.site import models
from localground.apps.site.tests import Client, ModelMixin
from rest_framework import status
from localground.apps.site.api.tests.renderer_tests import mixins

class GeoJSONRendererListTest(test.TestCase, ModelMixin):
    '''
    These tests test the GeoJSON renderer using the /api/0/markers/ (though any
    geospatial endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        self.url = '/api/0/markers/.geojson'
        
    def test_geojson_format_looks_correct(self):
        self.create_marker(self.user, self.project, name="Marker 1", geoJSON=mixins.point)
        self.create_marker(self.user, self.project, name="Marker 2", geoJSON=mixins.line)
        response = self.client_user.get(self.url)
        data = json.loads(response.content)
        
        # Check outer attributes:
        self.assertEqual(data.get("type"), "FeatureCollection")
        self.assertEqual(len(data.get("features")), 2)
        rec = data.get("features")[1]
        
        #Check inner attributes:
        self.assertEqual(rec.get("type"), "Feature")
        self.assertEqual(rec.get("geometry"), mixins.line)
        self.assertTrue(isinstance(rec.get("properties"), dict))
        
        # Make sure 'extras' attribute gets merged into the properties:
        self.assertEqual(rec.get("properties").get("key"), "value")
        
    def tearDown(self):
        models.Form.objects.all().delete()

      
class GeoJSONRendererInstanceTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        self.marker = self.create_marker(self.user, self.project, name="Marker 1", geoJSON=mixins.point)
        self.url = '/api/0/markers/%s/.geojson' % self.marker.id
        
    def test_geojson_format_looks_correct(self):
        response = self.client_user.get(self.url, format='json')
        data = json.loads(response.content)
        
        self.assertEqual(data.get("type"), "Feature")
        self.assertEqual(data.get("geometry"), mixins.point)
        self.assertTrue(isinstance(data.get("properties"), dict))
        
        # Make sure 'extras' attribute gets merged into the properties:
        self.assertEqual(data.get("properties").get("key"), "value")
