from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.marker_tests import get_metadata
from localground.apps.site.tests import Client, ModelMixin
import urllib, json
from rest_framework import status
point = {
    "type": "Point",
    "coordinates": [12.492324113849, 41.890307434153]
}
line = {
    "type": "LineString",
    "coordinates": [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]
}

class GeoJSONRendererListTest(test.TestCase, ModelMixin):
    '''
    These tests test the GeoJSON renderer using the /api/0/markers/ (though any
    geospatial endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        self.url = '/api/0/markers/.geojson'
        
    def test_geojson_format_looks_correct(self):
        self.create_marker(self.user, self.project, name="Marker 1", geoJSON=point)
        self.create_marker(self.user, self.project, name="Marker 2", geoJSON=line)
        response = self.client_user.get(self.url)
        data = json.loads(response.content)
        
        # Check outer attributes:
        self.assertEqual(data.get("type"), "FeatureCollection")
        self.assertEqual(len(data.get("features")), 2)
        rec = data.get("features")[1]
        
        #Check inner attributes:
        self.assertEqual(rec.get("type"), "Feature")
        self.assertEqual(rec.get("geometry"), line)
        self.assertTrue(isinstance(rec.get("properties"), dict))
        
        # Make sure 'extras' attribute gets merged into the properties:
        self.assertEqual(rec.get("properties").get("key"), "value")
        
    def tearDown(self):
        models.Form.objects.all().delete()

      
class GeoJSONRendererInstanceTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        self.marker = self.create_marker(self.user, self.project, name="Marker 1", geoJSON=point)
        self.url = '/api/0/markers/%s/.geojson' % self.marker.id
        
    def test_geojson_format_looks_correct(self):
        response = self.client_user.get(self.url, format='json')
        data = json.loads(response.content)
        
        self.assertEqual(data.get("type"), "Feature")
        self.assertEqual(data.get("geometry"), point)
        self.assertTrue(isinstance(data.get("properties"), dict))
        
        # Make sure 'extras' attribute gets merged into the properties:
        self.assertEqual(data.get("properties").get("key"), "value")
        
    
