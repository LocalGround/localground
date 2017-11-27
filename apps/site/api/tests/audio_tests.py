import urllib
import wave
import random
import struct
import json
from django import test
from django.conf import settings
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from rest_framework import status
from django.core.files import File


def get_metadata():
    return {
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False,
                         'type': 'field'},
        'file_path': {'read_only': True, 'required': False, 'type': 'field'},
        'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        "caption": {"type": "memo", "required": False, "read_only": False},
        "attribution": {"type": "string", "required": False,
                        "read_only": False},
        "media_file": {"type": "string", "required": True, "read_only": False},
        'extras': {'read_only': False, 'required': False, 'type': 'json'}
    }


ExtrasGood = '''{
    "source": "http://google.com",
    "video": "youtube.com",
    "order": 5
}'''


def makeTmpFile():
    import wave
    import random
    import struct

    # Create dummy audio file:
    tmp_file = open('/tmp/test.wav', 'w')
    noise_output = wave.open(tmp_file, 'w')
    noise_output.setparams((2, 2, 44100, 0, 'NONE', 'not compressed'))
    values = []
    SAMPLE_LEN = 44100 * 5

    for i in range(0, SAMPLE_LEN):
        value = random.randint(-32767, 32767)
        packed_value = struct.pack('h', value)
        values.append(packed_value)
        values.append(packed_value)

    value_str = ''.join(values)
    noise_output.writeframes(value_str)
    noise_output.close()
    return tmp_file


class ApiAudioListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/audio/']
        self.view = views.AudioList.as_view()
        self.metadata = get_metadata()

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
        url = '/api/0/audio/?project_id={0}'.format(self.project.id)
        response = self.client_user.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_audio_using_post(self, **kwargs):
        tmp_file = makeTmpFile()
        f = File(open('/tmp/test.wav'))
        author_string = 'Author of the media file'
        with open(tmp_file.name, 'rb') as data:
            response = self.client_user.post(
                self.urls[0], {
                    'project_id': self.project.id,
                    'media_file': f,
                    'attribution': author_string,
                    'extras': ExtrasGood
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            # a few more checks to make sure that file paths are being
            # generated correctly:
            new_audio = models.Audio.objects.get(id=response.data.get("id"))
            file_name = tmp_file.name.split("/")[-1]
            file_name = unicode(file_name, "utf-8")
            path = new_audio.encrypt_url(new_audio.file_name_new)
            self.assertEqual(json.loads(ExtrasGood), new_audio.extras)
            self.assertEqual(author_string, new_audio.attribution)
            self.assertEqual(file_name, new_audio.name)
            self.assertEqual(file_name, new_audio.file_name_orig)
            # ensure not empty:
            self.assertTrue(len(new_audio.file_name_new) > 5)


class ApiAudioInstanceTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.audio = self.create_audio()
        self.url = '/api/0/audio/%s/' % self.audio.id
        self.urls = [self.url]
        self.view = views.AudioInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            "media_file": {
                "type": "string", "required": False, "read_only": True
            }
        })

    def test_update_audio_using_put(self, **kwargs):
        name, caption = 'New Audio Name', 'Test description'
        point = {
            "type": "Point",
            "coordinates": [12.492324113849, 41.890307434153]
        }
        response = self.client_user.put(
            self.url, data=urllib.urlencode({
                'geometry': point,
                'name': name,
                'caption': caption,
                'extras': ExtrasGood,
                'tags': ''
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_audio = models.Audio.objects.get(id=self.audio.id)
        self.assertEqual(updated_audio.name, name)
        self.assertEqual(updated_audio.description, caption)
        self.assertEqual(response.data.get("caption"), caption)
        self.assertEqual(json.loads(ExtrasGood), updated_audio.extras)
        self.assertEqual(updated_audio.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_audio.geometry.x, point['coordinates'][0])

    def test_update_audio_using_patch(self, **kwargs):
        import json
        point = {
            "type": "Point",
            "coordinates": [12.492324113849, 41.890307434153]
        }
        response = self.client_user.patch(
            self.url,
            data=urllib.urlencode({'geometry': point}),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_audio = models.Audio.objects.get(id=self.audio.id)
        self.assertEqual(updated_audio.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_audio.geometry.x, point['coordinates'][0])

    def test_delete_audio(self, **kwargs):
        audio_id = self.audio.id

        # ensure audio exists:
        models.Audio.objects.get(id=audio_id)

        # delete audio:
        response = self.client_user.delete(
            self.url,
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
