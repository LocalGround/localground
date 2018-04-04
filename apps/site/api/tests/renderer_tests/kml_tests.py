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
    These tests test the KML renderer using the /api/0/datasets/<id>/data/
    (though any geospatial endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        self.form = self.create_form_with_fields(
            name="Class Form", num_fields=7
        )
        self.record1 = self.insert_form_data_record(
            form=self.form,
            project=self.project,
            geoJSON=mixins.point,
            name='rec1'
        )
        self.url = '/api/0/datasets/%s/data/' % (
            self.form.id
        )
        self.key = 'form_{0}'.format(self.form.id)

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        response = self.client_user.get(self.url, {
            'project_id': self.project.id,
            'format': 'kml'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_kml_is_valid_xml(self):
        self.insert_form_data_record(
            form=self.form,
            project=self.project,
            geoJSON=mixins.point2,
            name='rec2'
        )
        self.insert_form_data_record(
            form=self.form,
            project=self.project,
            geoJSON=mixins.point3,
            name='rec3'
        )
        response = self.client_user.get(self.url, {
            'project_id': self.project.id,
            'format': 'kml'
        })
        data = response.content
        is_valid = True
        try:
            self.validateXML(data)
        except SAXParseException:
            is_valid = False
        self.assertTrue(is_valid)
        for p in [mixins.point, mixins.point2, mixins.point3]:
            template = '<Point><coordinates>{},{},0</coordinates></Point>'
            self.assertTrue(template.format(
                p['coordinates'][0], p['coordinates'][1]) in data)

    def validateXML(self, data):
        parseString(data, ContentHandler())

    def tearDown(self):
        models.Form.objects.all().delete()


class KMLRendererInstanceTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        self.form = self.create_form_with_fields(
            name="Class Form", num_fields=7
        )
        self.record1 = self.insert_form_data_record(
            form=self.form,
            project=self.project,
            geoJSON=mixins.point,
            name='rec1'
        )
        self.url = '/api/0/datasets/%s/data/' % (
            self.form.id
        )
        self.key = 'form_{0}'.format(self.form.id)

    def test_kml_is_valid_xml(self):
        response = self.client_user.get(self.url + '?format=kml')
        data = response.content
        is_valid = True
        try:
            self.validateXML(data)
        except SAXParseException:
            is_valid = False
        template = '<Point><coordinates>{},{},0</coordinates></Point>'
        self.assertTrue(template.format(
                mixins.point['coordinates'][0],
                mixins.point['coordinates'][1]
            ) in data
        )
        self.assertTrue(is_valid)

    def validateXML(self, data):
        parseString(data, ContentHandler())
