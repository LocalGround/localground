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
        'description': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'string'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'audio_count': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        'map_image_count': {'read_only': True, 'required': False, 'type': 'field'},
        'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
        'record_count': {'read_only': True, 'required': False, 'type': 'field'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'color': {'read_only': False, 'required': False, 'type': 'color'},
        'name': {'read_only': False, 'required': False, 'type': 'string'}
    }

class GeomMixin(object):
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


class ApiMarkerListTest(test.TestCase, ViewMixinAPI, GeomMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/markers/']
        self.view = views.MarkerList.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            'update_metadata': {'read_only': True, 'required': False, 'type': 'field'}
        })
        

    def test_bad_json_create_fails(self, **kwargs):
        for k in ['Crazy1', 'Crazy2']:
            geom = getattr(self, k)
            for i, url in enumerate(self.urls):
                name, description, color = 'New Marker Name', \
                    'Test description', 'FF0000'
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode(
                        {
                            'geometry': geom,
                            'name': name,
                            'description': description,
                            'color': color}),
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
                        'description': description,
                        'color': color,
                        'project_id': self.project.id
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


class ApiMarkerInstanceTest(test.TestCase, ViewMixinAPI, GeomMixin):

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
        for k in ['Crazy1', 'Crazy2']:
            geom = getattr(self, k)
            for i, url in enumerate(self.urls):
                name, description, color = 'New Marker Name', \
                    'Test description', 'FF0000'
                response = self.client_user.put(
                    url,
                    data=urllib.urlencode(
                        {
                            'geometry': geom,
                            'name': name,
                            'description': description,
                            'color': color}),
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
                    data=urllib.urlencode(
                        {
                            'geometry': geom,
                            'name': name,
                            'description': description,
                            'color': color}),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                updated_marker = models.Marker.objects.get(id=self.marker.id)
                self.assertEqual(updated_marker.name, name)
                self.assertEqual(updated_marker.description, description)
                self.assertEqual(updated_marker.color, color)
                self.assertEqual(
                    updated_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))

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
