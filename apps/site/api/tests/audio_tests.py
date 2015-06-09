from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
from rest_framework import status

metadata = {
    'description': {'read_only': False, 'required': False, 'type': 'memo'},
    'file_name_orig': {'read_only': True, 'required': False, 'type': 'string'},
    'tags': {'read_only': False, 'required': False, 'type': 'string'},
    'url': {'read_only': True, 'required': False, 'type': 'field'},
    'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
    'file_path': {'read_only': True, 'required': False, 'type': 'field'},
    'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
    'owner': {'read_only': True, 'required': False, 'type': 'field'},
    'project_id': {'read_only': False, 'required': False, 'type': 'field'},
    'id': {'read_only': True, 'required': False, 'type': 'integer'},
    'name': {'read_only': False, 'required': False, 'type': 'string'}
}

class ApiAudioListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/audio/']
        self.view = views.AudioList.as_view()
        self.metadata = metadata

    def test_create_audio_using_post(self, **kwargs):
        # todo:  implement using a FILE upload
        self.assertEqual(1, 1)

class ApiAudioInstanceTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=True)
        self.audio = models.Audio.objects.get(id=1)
        self.url = '/api/0/audio/%s/' % self.audio.id
        self.urls = [self.url]
        self.view = views.AudioInstance.as_view()
        self.metadata = metadata

    def test_update_audio_using_put(self, **kwargs):
        name, description, color = 'New Audio Name', \
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
        updated_audio = models.Audio.objects.get(id=self.audio.id)
        self.assertEqual(updated_audio.name, name)
        self.assertEqual(updated_audio.description, description)
        self.assertEqual(updated_audio.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_audio.geometry.x, point['coordinates'][0])

    def test_update_audio_using_patch(self, **kwargs):
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
        updated_audio = models.Audio.objects.get(id=self.audio.id)
        self.assertEqual(updated_audio.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_audio.geometry.x, point['coordinates'][0])

    def test_delete_audio(self, **kwargs):
        audio_id = self.audio.id

        # ensure audio exists:
        models.Audio.objects.get(id=audio_id)

        # delete audio:
        response = self.client_user.delete(self.url,
                                           HTTP_X_CSRFTOKEN=self.csrf_token
                                           )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.Audio.objects.get(id=audio_id)
            # throw assertion error if audio still in database
            print 'Audio not deleted'
            self.assertEqual(1, 0)
        except models.Audio.DoesNotExist:
            # trigger assertion success if audio is removed
            self.assertEqual(1, 1)
