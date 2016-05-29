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
        'photo_count': {'read_only': True, 'required': False, 'type': 'field'},
        'audio_count': {'read_only': True, 'required': False, 'type': 'field'},
        'map_image_count': {'read_only': True, 'required': False, 'type': 'field'},
        'record_count': {'read_only': True, 'required': False, 'type': 'field'},
        'caption': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'color': {'read_only': False, 'required': False, 'type': 'color'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        'extras': {'read_only': False, 'required': False, 'type': 'json'}
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
    
    def test_metadata_only_available_with_flag(self, **kwargs):
        response = self.client_user.get(self.urls[0])
        m = response.data.get("results")[0]
        self.assertIsNone(m.get("update_metadata"))
        
        response = self.client_user.get(self.urls[0], {'include_metadata': True})
        m = response.data.get("results")[0]
        self.assertIsNotNone(m.get("update_metadata"))
        
    def test_arrays_available_when_flag_exists(self):
        #create some associations:
        self.photo1 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)
        self.create_relation(models.Photo.get_content_type(), marker=self.marker, id=self.photo1.id, ordering=1)
        self.create_relation(models.Audio.get_content_type(), marker=self.marker, id=self.audio1.id, ordering=1)
        response = self.client_user.get(
            self.urls[0], {'marker_with_media_arrays': True}
        )
        marker = response.data.get("results")[0]
        self.assertEqual(len(marker.get('photo_array')), 1)
        self.assertEqual(len(marker.get('audio_array')), 1)
        self.assertTrue('record_array' in marker)
        self.assertTrue('map_image_array' in marker)
        

    def test_bad_json_creates_fails(self, **kwargs):
        # 1. define a series of bad JSON dictionaries
        for d in [{'geometry': self.Crazy1}, {'geometry': self.Crazy2}, {'extras': self.ExtrasBad}]:
            params = {
                'name': 'New Marker Name',
                'caption': 'Test description',
                'color': 'FF0000',
                'geometry': self.Point,
                'project_id': self.project.id,
                'extras': self.ExtrasGood
            }
            # 2. update the params dictionary with the invalid dictionary entry.
            params.update(d)
            for i, url in enumerate(self.urls):
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
            name, description, color = 'New Marker 1', 'Test description1', 'FF0000'
            for k in ['Point', 'LineString', 'Polygon']:
                geom = getattr(self, k)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode({
                        'geometry': geom,
                        'name': name,
                        'caption': description,
                        'color': color,
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
                self.assertEqual(new_marker.color, color)
                self.assertEqual(
                    new_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))
                self.assertEqual(k, new_marker.geometry.geom_type)
                self.assertEqual(new_marker.project.id, self.project.id)
                self.assertEqual(new_marker.extras, json.loads(self.ExtrasGood))


class ApiMarkerInstanceTest(test.TestCase, ViewMixinAPI, DataMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=True)
        self.marker = self.get_marker()
        self.urls = ['/api/0/markers/%s/' % self.marker.id]
        self.view = views.MarkerInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            'children': {'read_only': True, 'required': False, 'type': u'field'},
            'form_ids': {'read_only': True, 'required': False, 'type': u'field'}
        })

    def test_bad_json_update_fails(self, **kwargs):
        # 1. define a series of bad JSON dictionaries
        for d in [{'geometry': self.Crazy1}, {'geometry': self.Crazy2}, {'extras': self.ExtrasBad}]:
            params = {
                'name': 'New Marker Name',
                'caption': 'Test description',
                'color': 'FF0000',
                'geometry': self.Point,
                'extras': self.ExtrasGood
            }
            # 2. update the params dictionary with the invalid dictionary entry.
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
                name, description, color = 'New Marker Name', \
                    'Test description', 'FF0000'
                response = self.client_user.put(
                    url,
                    data=urllib.urlencode({
                        'geometry': geom,
                        'name': name,
                        'caption': description,
                        'color': color,
                        'extras': self.ExtrasGood
                    }),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                updated_marker = models.Marker.objects.get(id=self.marker.id)
                result_json = response.data
                self.assertEqual(updated_marker.name, name)
                self.assertEqual(updated_marker.description, description)
                self.assertEqual(updated_marker.color, color)
                self.assertEqual(
                    updated_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))
                self.assertEqual(updated_marker.extras, json.loads(self.ExtrasGood))
                self.assertEqual(result_json.get('photo_count'), 0)
                self.assertEqual(result_json.get('audio_count'), 0)
                self.assertEqual(result_json.get('map_image_count'), 0)
                self.assertEqual(result_json.get('record_count'), 0)

    def test_update_marker_using_patch(self, **kwargs):
        for k in ['Point', 'LineString', 'Polygon']:
            geom = getattr(self, k)
            for i, url in enumerate(self.urls):
                response = self.client_user.patch(url,
                                                  data=urllib.urlencode({'geometry': geom}),
                                                  HTTP_X_CSRFTOKEN=self.csrf_token,
                                                  content_type="application/x-www-form-urlencoded")
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
        response = self.client_user.delete('/api/0/markers/%s/' % marker_id,
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
