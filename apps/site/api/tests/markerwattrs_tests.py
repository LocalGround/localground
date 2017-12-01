from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from django.contrib.gis.geos import GEOSGeometry
from localground.apps.site.tests import Client, ModelMixin

def get_metadata():
    return {
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
        'form': {'read_only': True, 'required': False, 'type': 'field'}
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



class APIMarkerWAttrsInstanceTest(test.TestCase, ViewMixinAPI, DataMixin):
    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.view = views.MarkerWAttrsInstance.as_view()
        self.metadata = get_metadata()
        self.markerwattrs = self.create_marker_w_attrs(self.user, self.project)
        self.urls = ['/api/0/forms/%s/data/%s/' % (self.markerwattrs.form.id, self.markerwattrs.id)]

    #def tearDown(self):
        # delete method also removes files from file system:
        # models.Photo.objects.all().delete()
        # models.Audio.objects.all().delete()

    def test_something(self):
        self.assertAlmostEqual(1, 1)

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
                'color': 'FF0000',
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


    # def test_update_marker_using_patch(self, **kwargs):
    #     for k in ['Point', 'LineString', 'Polygon']:
    #         geom = getattr(self, k)
    #         for url in self.urls:
    #             response = self.client_user.patch(
    #                 url,
    #                 data=urllib.urlencode({'geometry': geom}),
    #                 HTTP_X_CSRFTOKEN=self.csrf_token,
    #                 content_type="application/x-www-form-urlencoded"
    #             )
    #             self.assertEqual(response.status_code, status.HTTP_200_OK)
    #             updated_marker = models.Marker.objects.get(id=self.marker.id)
    #             self.assertEqual(
    #                 updated_marker.geometry,
    #                 GEOSGeometry(
    #                     json.dumps(geom)))
