from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.marker_tests import get_metadata
from localground.apps.site.tests import Client, ModelMixin
import urllib, json
from rest_framework import status
from StringIO import StringIO
import zipfile
from xml.sax import parseString
from xml.sax.handler import ContentHandler
from xml.sax import SAXParseException

point = {
    "type": "Point",
    "coordinates": [12.492324113849, 41.890307434153]
}
point2 = {
    "type": "Point",
    "coordinates": [1.24232411384, 4.189030743415]
}
point3 = {
    "type": "Point",
    "coordinates": [124.002324113849, 54.18903074341]
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

class KMLRendererListTest(test.TestCase, ModelMixin):
    '''
    These tests test the KML renderer using the /api/0/markers/ (though any
    geospatial endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        self.url = '/api/0/markers/'
        
    def test_kml_is_valid_xml(self):
        self.create_marker(self.user, self.project, name="Marker 1", geoJSON=point)
        self.create_marker(self.user, self.project, name="Marker 2", geoJSON=point2)
        self.create_marker(self.user, self.project, name="Marker 3", geoJSON=point3)
        response = self.client_user.get(self.url + '?format=kml')
        data = response.content
        is_valid = True
        try:
            self.validateXML(data)
        except SAXParseException:
            is_valid = False
        self.assertTrue(is_valid)
        for p in [point, point2, point3]:
            point_template = '<Point><coordinates>{},{},0</coordinates></Point>'
            self.assertTrue(point_template.format(p['coordinates'][0], p['coordinates'][1]) in data)

    def validateXML(self, data):
        parseString(data, ContentHandler())
        
    def tearDown(self):
        models.Form.objects.all().delete()


class KMLRendererInstanceTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        self.marker = self.create_marker(self.user, self.project, name="Marker 1", geoJSON=point)
        self.url = '/api/0/markers/%s/' % self.marker.id
        
    def test_kml_is_valid_xml(self):
        response = self.client_user.get(self.url + '?format=kml')
        data = response.content
        is_valid = True
        try:
            self.validateXML(data)
        except SAXParseException:
            is_valid = False
        point_template = '<Point><coordinates>{},{},0</coordinates></Point>'
        self.assertTrue(point_template.format(point['coordinates'][0], point['coordinates'][1]) in data)
        self.assertTrue(is_valid)
        
    def validateXML(self, data):
        parseString(data, ContentHandler())

class ZIPRendererListTest(test.TestCase, ModelMixin):
    '''
    These tests test the ZIP renderer using the /api/0/photos/ (though any
    geospatial endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        self.url = '/api/0/photos/'
        
    def test_zip_is_valid(self):
        self.photo1 = self.create_photo(self.user, self.project, name="Photo 1", file_name='test_photo1.jpg')
        self.photo2 = self.create_photo(self.user, self.project, name="Photo 2", file_name='test_photo2.jpg')
        self.photo3 = self.create_photo(self.user, self.project, name="Photo 3", file_name='test_photo3.jpg')
        response = self.client_user.get(self.url + '?format=zip')
        data = StringIO(response.content)
        # Check if the zip file is not corrupted
        z = zipfile.ZipFile(data, 'r')
        # Read all the files in the zip and check their CRCs and file headers.
        # Return the name of the first file with an error, or else return None.
        valid_if_none = z.testzip()
        self.assertIsNone(valid_if_none)
        z.close()

class ZIPRendererInstanceTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        self.photo = self.create_photo(self.user, self.project, name="Photo 1", file_name='test_photo.jpg')
        self.url = '/api/0/photos/%s/' % self.photo.id
        
    def test_zip_is_valid(self):
        response = self.client_user.get(self.url + '?format=zip')
        data = StringIO(response.content)
        # Check if the zip file is not corrupted
        z = zipfile.ZipFile(data, 'r')
        # Read all the files in the zip and check their CRCs and file headers.
        # Return the name of the first file with an error, or else return None.
        valid_if_none = z.testzip()
        self.assertIsNone(valid_if_none)
        z.close()
