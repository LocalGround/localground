import csv
from django import test
from localground.apps.site.tests import Client, ModelMixin
from rest_framework import status
from StringIO import StringIO
from django.contrib.gis.geos import Point
from localground.apps.site.api.tests.renderer_tests import mixins
from localground.apps.site import models


class CSVMixin(mixins.MediaMixin):

    def test_csv_is_valid_for_objects(self):
        # issuing tests for many URL endpoints (photos, audio,
        # map images, markers, projects, and prints):
        for url in self.urls:
            response = self.client_user.get(url)
            data = StringIO(response.content)
            reader = csv.DictReader(data)
            types_without_lat_lngs = ['map-image', 'project', 'print']
            header_row = reader.fieldnames
            cnt_track_both_objects_present = 0
            test_record = None
            for row in reader:
                if row.get('name') == 'f1' or row.get('map_title') == 'f1':
                    test_record = row
                if row.get('name') in ['f1', 'f2'] \
                        or row.get('map_title') in ['f1', 'f2']:
                    cnt_track_both_objects_present += 1

            # test that the expected models are present in CSV file:
            if self.isList:
                self.assertEqual(cnt_track_both_objects_present, 2)
            else:
                self.assertEqual(cnt_track_both_objects_present, 1)

            # get fields:
            response = self.client_user.options(
                url,
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded"
            )

            # TEST 1: there is a cell for every field exposed in the serializer
            # (+ lat, lng, if applicable):
            if self.isList:
                headers = response.data['actions'].get('POST').keys()
            else:
                headers = response.data['actions'].get('PUT').keys()
                if 'media' in headers:
                    headers.remove('media')  # for instances
            if test_record.get('overlay_type') not in types_without_lat_lngs:
                headers += ['lat', 'lng']
            if '/datasets/' not in url:
                self.assertSetEqual(set(headers), set(header_row))

            # TEST 2: lat/lng are populated, if applicable:
            if test_record.get('overlay_type') not in types_without_lat_lngs:
                self.assertEqual(test_record.get('lng'), str(self.lng))
                self.assertEqual(test_record.get('lat'), str(self.lat))

            # TEST 3: tags have been flattened:
            self.assertEqual(test_record.get('tags'), ', '.join(self.tags1))

    def _test_media_flattened_for_records(self, is_detail=False):
        url = '/api/0/datasets/{}/data/'.format(self.records[0].form.id)
        if is_detail:
            url = '/api/0/datasets/{}/data/{}/'.format(
                self.records[0].form.id, self.records[0].id)
        response = self.client_user.get(url + '?format=csv')
        data = StringIO(response.content)
        reader = csv.DictReader(data)
        for row in reader:
            fields = [
                'field_8_detail.id',
                'field_8_detail.file_name_medium',
                'field_8_detail.file_name_medium_sm',
                'field_8_detail.file_name_small',
                'field_9_detail.id',
                'field_9_detail.file_path'
            ]
            for key in fields:
                self.assertTrue(row.get(key))


class CSVRendererListTest(CSVMixin, test.TestCase, ModelMixin):
    '''
    These tests test the ZIP renderer using the /api/0/photos/ (though any
    geospatial endpoint could be used).
    '''
    def setUp(self):
        ModelMixin.setUp(self)
        CSVMixin.setUp(self)
        self.urls = [
            '/api/0/photos/?project_id={0}&format=csv'.format(self.project.id),
            '/api/0/audio/?project_id={0}&format=csv'.format(self.project.id),
            '/api/0/map-images/?project_id={0}&format=csv'.format(
                self.project.id),
            '/api/0/markers/?project_id={0}&format=csv'.format(
                self.project.id),
            '/api/0/projects/?format=csv',
            '/api/0/prints/?project_id={0}&format=csv'.format(self.project.id)
        ]
        self.isList = True

    '''
    def test_media_flattened_for_records(self):
        self._test_media_flattened_for_records(is_detail=False)
    '''


class CSVRendererInstanceTest(CSVMixin, test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        CSVMixin.setUp(self)
        self.urls = [
            '/api/0/photos/{}/?format=csv'.format(self.photo1.id),
            '/api/0/audio/{}/?format=csv'.format(self.audio1.id),
            '/api/0/map-images/{}/?format=csv'.format(self.map_image1.id),
            '/api/0/markers/{}/?format=csv'.format(self.marker1.id),
            '/api/0/projects/{}/?format=csv'.format(self.project1.id),
            '/api/0/prints/{}/?format=csv'.format(self.print1.id)
        ]
        self.isList = False

    '''
    def test_media_flattened_for_record(self):
        self._test_media_flattened_for_records(is_detail=True)
    '''

    def test_project_instance_includes_child_records(self):
        url = '/api/0/projects/{}/'.format(self.project.id)
        response = self.client_user.get(url + '?format=csv')
        data = StringIO(response.content)
        # print data
        reader = csv.DictReader(data)
        expected = {
            'form_{}'.format(self.form.id): 8,
            'project': 1,
            'photo': 2,
            'audio': 2,
            'map-image': 2,
            'marker': 2
        }
        actual = {}
        for row in reader:
            key = row.get('overlay_type')
            if not actual.get(key):
                actual[key] = 0
            actual[key] += 1
        # print 'Expected', expected.keys()
        # print 'Actual', actual.keys()
        self.assertSetEqual(set(expected.keys()), set(actual.keys()))
        for key in expected.keys():
            self.assertEqual(expected[key], actual[key])

    def test_marker_instance_has_child_records(self):
        self.create_relation(self.marker1, self.photo1)
        self.create_relation(self.marker1, self.photo2)
        self.create_relation(self.marker1, self.audio1)
        self.create_relation(self.marker1, self.audio2)
        self.create_relation(self.marker1, self.record1)
        self.create_relation(self.marker1, self.record2)

        url = '/api/0/markers/{}/'.format(self.marker1.id)
        response = self.client_user.get(url + '?format=csv')
        data = StringIO(response.content)
        reader = csv.DictReader(data)
        expected = {
            'marker': 1,
            'photo': 2,
            'audio': 2,
        }
        actual = {}
        for row in reader:
            key = row.get('overlay_type')
            if not actual.get(key):
                actual[key] = 0
            actual[key] += 1
        self.assertSetEqual(set(expected.keys()), set(actual.keys()))
        for key in expected.keys():
            self.assertEqual(expected[key], actual[key])
