from django import test
from django.conf import settings
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib, wave, random, struct
from rest_framework import status
import json

def get_metadata():
    return {
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        "caption": {"type": "memo", "required": False, "read_only": False},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'video_id': {'read_only': False, 'required': True, 'type': 'string'},
        'video_provider': {'read_only': False, 'required': True, 'type': 'choice'},
        'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
        'project_id': {'read_only': False, 'required': False, 'type': 'field'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        "attribution": {"type": "string", "required": False, "read_only": False}
    }


class ApiVideoListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/videos/']
        self.view = views.VideoList.as_view()
        self.metadata = get_metadata()

    
class ApiVideoInstanceTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=True)
        self.video = self.create_video(self.user, self.project)
        self.url = '/api/0/videos/%s/' % self.video.id
        self.urls = [self.url]
        self.view = views.VideoInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({"media_file": { "type": "string", "required": False, "read_only": True }})

    def test_update_video_using_put(self, **kwargs):
        name, caption = 'New Video Name', 'Test description'
        point = {
            "type": "Point",
            "coordinates": [12.492324113849, 41.890307434153]
        }
        response = self.client_user.put(self.url,
                            data=urllib.urlencode({
                                'geometry': point,
                                'name': name,
                                'caption': caption,
                                'tags' : "",
                                'video_id': '344533',
                                'provider': 'vimeo'
                            }),
                            HTTP_X_CSRFTOKEN=self.csrf_token,
                            content_type="application/x-www-form-urlencoded"
                        )
        #print response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_video = models.Video.objects.get(id=self.video.id)
        self.assertEqual(updated_video.name, name)
        self.assertEqual(updated_video.description, caption)
        self.assertEqual(response.data.get("caption"), caption)
        self.assertEqual(updated_video.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_video.geometry.x, point['coordinates'][0])
        self.assertEqual(updated_video.video_id, '344533')
        self.assertEqual(updated_video.provider, 'vimeo')


    def test_update_video_using_patch(self, **kwargs):
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
        updated_video = models.Video.objects.get(id=self.video.id)
        self.assertEqual(updated_video.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_video.geometry.x, point['coordinates'][0])

    def test_delete_video(self, **kwargs):
        video_id = self.video.id

        # ensure video exists:
        models.Video.objects.get(id=video_id)

        # delete video:
        response = self.client_user.delete(self.url,
                                           HTTP_X_CSRFTOKEN=self.csrf_token
                                           )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.Video.objects.get(id=video_id)
            # throw assertion error if video still in database
            print 'Video not deleted'
            self.assertEqual(1, 0)
        except models.Video.DoesNotExist:
            # trigger assertion success if video is removed
            self.assertEqual(1, 1)

#handle crazy data "This video does not exist", "Video ID is in the incorrect format"
