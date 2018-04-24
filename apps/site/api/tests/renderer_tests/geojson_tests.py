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

        self.dataset = self.create_form_with_fields(
            name="Class Dataset", num_fields=7
        )
        self.record1 = self.insert_form_data_record(
            dataset=self.dataset,
            project=self.project,
            geoJSON=mixins.point,
            name='rec1'
        )
        self.record2 = self.insert_form_data_record(
            dataset=self.dataset,
            project=self.project,
            geoJSON=mixins.line,
            name='rec2'
        )
        self.url = '/api/0/datasets/%s/data/' % (
            self.dataset.id
        )
        self.key = 'dataset_{0}'.format(self.dataset.id)

    def test_geojson_format_looks_correct(self):

        response = self.client_user.get(self.url, {
                'format': 'geojson',
                'project_id': self.project.id
            })
        data = json.loads(response.content)

        # Check outer attributes:
        self.assertEqual(data.get("type"), "FeatureCollection")
        self.assertEqual(len(data.get("features")), 2)
        rec = data.get("features")[1]

        # Check inner attributes:
        self.assertEqual(rec.get("type"), "Feature")
        self.assertEqual(rec.get("geometry"), mixins.line)
        self.assertTrue(isinstance(rec.get("properties"), dict))

    def tearDown(self):
        models.Dataset.objects.all().delete()


class GeoJSONRendererInstanceTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        self.dataset = self.create_form_with_fields(
            name="Class Dataset", num_fields=7
        )
        self.record1 = self.insert_form_data_record(
            dataset=self.dataset,
            geoJSON=mixins.point,
            project=self.project,
            name='rec1'
        )
        self.record2 = self.insert_form_data_record(
            dataset=self.dataset,
            geoJSON=mixins.line,
            project=self.project,
            name='rec2'
        )
        self.url = '/api/0/datasets/%s/data/%s/' % (
            self.dataset.id, self.record1.id
        )
        self.key = 'dataset_{0}'.format(self.dataset.id)

    def test_geojson_format_looks_correct(self):
        response = self.client_user.get(self.url, {
                'format': 'geojson'
            }, format='json')
        data = json.loads(response.content)

        self.assertEqual(data.get("type"), "Feature")
        self.assertEqual(data.get("geometry"), mixins.point)
        self.assertTrue(isinstance(data.get("properties"), dict))
