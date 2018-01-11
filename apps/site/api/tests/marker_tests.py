from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from django.contrib.gis.geos import GEOSGeometry


def get_metadata():
    return {
        'attached_photos_ids': {
            'read_only': True, 'required': False, 'type': 'field'},
        'attached_audio_ids': {
            'read_only': True, 'required': False, 'type': 'field'},
        'attached_videos_ids': {
            'read_only': True, 'required': False, 'type': 'field'},
        'attached_map_images_id': {
            'read_only': True, 'required': False, 'type': 'field'},
        'caption': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False,
                         'type': 'field'},
        'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        'extras': {'read_only': False, 'required': False, 'type': 'json'},
    }


class DataMixin(object):
    Point = {
        "type": "Point",
        "coordinates": [12.492324113849, 41.890307434153]
    }
    LineString = {
        "type": "LineString",
        "coordinates": [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]
    }
    Polygon = {
        "type": "Polygon",
        "coordinates": [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                         [100.0, 1.0], [100.0, 0.0]]]
    }
    Crazy1 = {
        "type": "Polygon1",
        "coordinates": [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                         [100.0, 1.0], [100.0, 0.0]]]
    }
    Crazy2 = {
        "type": "Polygon",
        "coordinates": [[[100.0, 0.0, 6, 8], [101.0, 0.0], [101.0, 1.0],
                         [100.0, 1.0], [100.0, 0.0]]]
    }
    ExtrasGood = '''{
        "source": "http://google.com",
        "video": "youtube.com",
        "order": 5
    }'''
    ExtrasBad = '''{
        "source": "http://google.com",
        "video",
        "order": 5
    }'''


class ApiMarkerListTest(test.TestCase, ViewMixinAPI, DataMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/markers/']
        self.view = views.MarkerList.as_view()
        self.metadata = get_metadata()
        self.marker = self.create_marker(self.user, self.project)

    def tearDown(self):
        # delete method also removes files from file system:
        models.Photo.objects.all().delete()
        models.Audio.objects.all().delete()

    def test_page_500_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_user.get(url)
            self.assertEqual(
                response.status_code,
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        for url in self.urls:
            response = self.client_user.get(url, {
                'project_id': self.project.id
            })
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_arrays_available_when_flag_exists(self):
        # create some associations:
        self.photo1 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)
        self.create_relation(self.marker, self.photo1)
        self.create_relation(self.marker, self.audio1)
        response = self.client_user.get(
            self.urls[0], {
                'marker_with_media_arrays': True,
                'project_id': self.project.id
            }
        )
        marker = response.data.get("results")[0]
        self.assertEqual(len(marker.get('attached_photos_ids')), 1)
        self.assertEqual(len(marker.get('attached_audio_ids')), 1)
        self.assertTrue('attached_map_images_id' in marker)

        # clean up:
        self.delete_relation(self.marker, self.photo1)
        self.delete_relation(self.marker, self.audio1)

    def test_bad_json_creates_fails(self, **kwargs):
        # 1. define a series of bad JSON dictionaries
        for d in [
            {'geometry': self.Crazy1},
            {'geometry': self.Crazy2},
            {'extras': self.ExtrasBad}
        ]:
            params = {
                'name': 'New Marker Name',
                'caption': 'Test description',
                'geometry': self.Point,
                'project_id': self.project.id,
                'extras': self.ExtrasGood
            }
            # 2. update the params dictionary with the invalid dictionary entry
            params.update(d)
            for i, url in enumerate(self.urls):
                url = url + '?project_id={0}'.format(self.project.id)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode(params),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST)

    def test_create_marker_point_line_poly_using_post(self, **kwargs):
        for i, url in enumerate(self.urls):
            name = 'New Marker 1'
            description = 'Test description1'
            for k in ['Point', 'LineString', 'Polygon']:
                geom = getattr(self, k)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode({
                        'geometry': geom,
                        'name': name,
                        'caption': description,
                        'project_id': self.project.id,
                        'extras': self.ExtrasGood
                    }),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                if response.status_code != status.HTTP_201_CREATED:
                    print response.data
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
                new_marker = models.Marker.objects.all().order_by('-id',)[0]
                self.assertEqual(new_marker.name, name)
                self.assertEqual(new_marker.description, description)
                self.assertEqual(
                    new_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))
                self.assertEqual(k, new_marker.geometry.geom_type)
                self.assertEqual(new_marker.project.id, self.project.id)
                self.assertEqual(
                    new_marker.extras, json.loads(self.ExtrasGood)
                )


class ApiMarkerInstanceTest(test.TestCase, ViewMixinAPI, DataMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.marker = self.create_marker(self.user, self.project)
        self.url = '/api/0/markers/%s/' % self.marker.id
        self.urls = [self.url]
        self.view = views.MarkerInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            'children': {'read_only': True, 'required': False,
                         'type': u'field'}
        })

    def tearDown(self):
        # delete method also removes files from file system:
        models.Photo.objects.all().delete()
        models.Audio.objects.all().delete()

    def test_bad_json_update_fails(self, **kwargs):
        # 1. define a series of bad JSON dictionaries
        for d in [
            {'geometry': self.Crazy1},
            {'geometry': self.Crazy2},
            {'extras': self.ExtrasBad}
        ]:
            params = {
                'name': 'New Marker Name',
                'caption': 'Test description',
                'geometry': self.Point,
                'extras': self.ExtrasGood
            }
            # 2. update the params dictionary with the invalid dictionary entry
            params.update(d)
            for i, url in enumerate(self.urls):
                response = self.client_user.put(
                    url,
                    data=urllib.urlencode(params),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST)

    def test_update_marker_using_put(self, **kwargs):
        for k in ['Point', 'LineString', 'Polygon']:
            geom = getattr(self, k)
            for i, url in enumerate(self.urls):
                name, description = 'New Marker Name', \
                    'Test description'
                response = self.client_user.put(
                    url,
                    data=urllib.urlencode({
                        'geometry': geom,
                        'name': name,
                        'caption': description,
                        'extras': self.ExtrasGood
                    }),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                updated_marker = models.Marker.objects.get(id=self.marker.id)
                result_json = response.data
                self.assertEqual(updated_marker.name, name)
                self.assertEqual(updated_marker.description, description)
                self.assertEqual(
                    updated_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))
                self.assertEqual(
                    updated_marker.extras, json.loads(self.ExtrasGood)
                )
                self.assertEqual(result_json.get('attached_photos_ids'), None)
                self.assertEqual(result_json.get('attached_audio_ids'), None)
                self.assertEqual(result_json.get('attached_video_ids'), None)

    def test_update_marker_using_patch(self, **kwargs):
        for k in ['Point', 'LineString', 'Polygon']:
            geom = getattr(self, k)
            for i, url in enumerate(self.urls):
                response = self.client_user.patch(
                    url,
                    data=urllib.urlencode({'geometry': geom}),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded"
                )
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                updated_marker = models.Marker.objects.get(id=self.marker.id)
                self.assertEqual(
                    updated_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))

    def test_delete_marker(self, **kwargs):
        marker_id = self.marker.id

        # ensure marker exists:
        models.Marker.objects.get(id=marker_id)

        # delete marker:
        response = self.client_user.delete(
            '/api/0/markers/%s/' % marker_id,
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.Marker.objects.get(id=marker_id)
            # throw assertion error if marker still in database
            print 'Marker not deleted'
            self.assertEqual(1, 0)
        except models.Marker.DoesNotExist:
            # trigger assertion success if marker is removed
            self.assertEqual(1, 1)

    def test_child_serializer(self, **kwargs):
        self.photo1 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)
        self.create_relation(self.marker, self.photo1)
        self.create_relation(self.marker, self.audio1)

        response = self.client_user.get(self.url)
        self.assertEqual(len(response.data['children']['photos']['data']), 1)
        self.assertEqual(len(response.data['children']['audio']['data']), 1)

        # clean up:
        self.delete_relation(self.marker, self.photo1)
        self.delete_relation(self.marker, self.audio1)
