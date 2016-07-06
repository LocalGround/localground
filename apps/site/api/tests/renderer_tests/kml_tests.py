from django import test
from localground.apps.site import models
from localground.apps.site.tests import Client, ModelMixin
from rest_framework import status
from xml.sax import parseString
from xml.sax.handler import ContentHandler
from xml.sax import SAXParseException
from localground.apps.site.api.tests.renderer_tests import mixins

# TODO: This needs tests for Line and Polygon

class KMLRendererListTest(test.TestCase, ModelMixin):
    '''
    These tests test the KML renderer using the /api/0/markers/ (though any
    geospatial endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        self.url = '/api/0/markers/'
        
    def test_kml_is_valid_xml(self):
        self.create_marker(self.user, self.project, name="Marker 1", geoJSON=mixins.point)
        self.create_marker(self.user, self.project, name="Marker 2", geoJSON=mixins.point2)
        self.create_marker(self.user, self.project, name="Marker 3", geoJSON=mixins.point3)
        response = self.client_user.get(self.url + '?format=kml')
        data = response.content
        is_valid = True
        try:
            self.validateXML(data)
        except SAXParseException:
            is_valid = False
        self.assertTrue(is_valid)
        for p in [mixins.point, mixins.point2, mixins.point3]:
            point_template = '<Point><coordinates>{},{},0</coordinates></Point>'
            self.assertTrue(point_template.format(p['coordinates'][0], p['coordinates'][1]) in data)

    def validateXML(self, data):
        parseString(data, ContentHandler())
        
    def tearDown(self):
        models.Form.objects.all().delete()

class KMLRendererInstanceTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        self.marker = self.create_marker(self.user, self.project, name="Marker 1", geoJSON=mixins.point)
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
        self.assertTrue(point_template.format(mixins.point['coordinates'][0], mixins.point['coordinates'][1]) in data)
        self.assertTrue(is_valid)
        
    def validateXML(self, data):
        parseString(data, ContentHandler())