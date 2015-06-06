from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI

import urllib
from rest_framework import status

metadata = {
    "url": { "type": "field", "required": False, "read_only": True },
    "id": { "type": "integer", "required": False, "read_only": True },
    "name": { "type": "string", "required": False, "read_only": False },
    "description": { "type": "memo", "required": False, "read_only": False },
    "overlay_type": { "type": "field", "required": False, "read_only": True },
    "tags": { "type": "string", "required": False, "read_only": False },
    "owner": { "type": "field", "required": False, "read_only": True },
    "project_id": { "type": "field", "required": False, "read_only": False },
    "geometry": { "type": "geojson", "required": False, "read_only": False },
    "attribution": { "type": "string", "required": False, "read_only": False },
    "file_name": { "type": "string", "required": False, "read_only": True },
    "caption": { "type": "memo", "required": False, "read_only": False },
    "path_large": { "type": "field", "required": False, "read_only": True },
    "path_medium": { "type": "field", "required": False, "read_only": True },
    "path_medium_sm": { "type": "field", "required": False, "read_only": True },
    "path_small": { "type": "field", "required": False, "read_only": True },
    "path_marker_lg": { "type": "field", "required": False, "read_only": True },
    "path_marker_sm": { "type": "field", "required": False, "read_only": True },
    "file_name_orig": { "type": "string", "required": False, "read_only": True }
}

class ApiPhotoListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/photos/']
        self.view = views.PhotoList.as_view()
        self.metadata = metadata

    def test_create_photo_using_post(self, **kwargs):
        # todo:  implement using a FILE upload
        self.assertEqual(1, 1)

class ApiPhotoInstanceTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=True)
        self.photo = models.Photo.objects.get(id=1)
        self.url = '/api/0/photos/%s/' % self.photo.id
        self.urls = [self.url]
        self.view = views.PhotoInstance.as_view()
        self.metadata = metadata

    def test_update_photo_using_put(self, **kwargs):
        name, description, color = 'New Photo Name', \
            'Test description', 'FF0000'
        point = {
            "type": "Point",
            "coordinates": [12.492324113849, 41.890307434153]
        }
        response = self.client_user.put(self.url,
                            data=urllib.urlencode({
                                'geometry': point,
                                'name': name,
                                'description': description
                            }),
                            HTTP_X_CSRFTOKEN=self.csrf_token,
                            content_type="application/x-www-form-urlencoded"
                        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_photo = models.Photo.objects.get(id=self.photo.id)
        self.assertEqual(updated_photo.name, name)
        self.assertEqual(updated_photo.description, description)
        self.assertEqual(updated_photo.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_photo.geometry.x, point['coordinates'][0])

    def test_update_photo_using_patch(self, **kwargs):
        import json
        point = {
            "type": "Point",
            "coordinates": [12.492324113849, 41.890307434153]
        }
        response = self.client_user.patch(self.url,
                                          data=urllib.urlencode({'geometry': point}),
                                          HTTP_X_CSRFTOKEN=self.csrf_token,
                                          content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_photo = models.Photo.objects.get(id=self.photo.id)
        self.assertEqual(updated_photo.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_photo.geometry.x, point['coordinates'][0])

    def test_delete_photo(self, **kwargs):
        photo_id = self.photo.id

        # ensure photo exists:
        models.Photo.objects.get(id=photo_id)

        # delete photo:
        response = self.client_user.delete(self.url,
                                           HTTP_X_CSRFTOKEN=self.csrf_token
                                           )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.Photo.objects.get(id=photo_id)
            # throw assertion error if photo still in database
            print 'Photo not deleted'
            self.assertEqual(1, 0)
        except models.Photo.DoesNotExist:
            # trigger assertion success if photo is removed
            self.assertEqual(1, 1)
