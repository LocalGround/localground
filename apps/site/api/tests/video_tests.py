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


def get_metadata():
    return {
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        "caption": {"type": "memo", "required": False, "read_only": False},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'video_id': {'read_only': False, 'required': True, 'type': 'string'},
        'video_provider': {'read_only': False, 'required': True,
                           'type': 'choice'},
        'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
        'project_id': {'read_only': False, 'required': True, 'type': 'field'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False,
                         'type': 'field'},
        "attribution": {"type": "string", "required": False,
                        "read_only": False}
    }


class ApiVideoListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/videos/']
        self.url = self.urls[0]
        self.create_video(
            self.user,
            self.project,
            name='YT',
            provider='youtube',
            video_id='4232534'
        )
        self.create_video(self.user, self.project, name='Vim',
                          provider='vimeo', video_id='dasdsadas')
        self.view = views.VideoList.as_view()
        self.metadata = get_metadata()

    '''
    Todo:
        * ensure that POST only creates new videos when required
          parameters are included
        * ensure that POST updates all DB fields when all params are specified
    '''

    def test_video_list_returns_all_videos(self, **kwargs):
        response = self.client_user.get(self.url)
        results = response.data.get("results")
        r1 = results[0]
        r2 = results[1]
        self.assertEqual(r1.get("name"), 'Vim')
        self.assertEqual(r2.get("name"), 'YT')
        self.assertEqual(len(results), 2)

    def test_post_creates_videos_only_when_has_required_params(self, **kwargs):
        response = self.client_user.post(
            self.url,
            data=urllib.urlencode({
                'owner': self.user,
                'project_id': self.project.id,
                'video_provider': 'youtube'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_updates_all_fields_when_all_params_included(self, **kwargs):
        import json
        name, caption = 'New Video Name for POST', 'POST test description'
        point = {
            "type": "Point",
            "coordinates": [12.492324113849, 41.890307434153]
        }
        response = self.client_user.post(
            self.url,
            data=urllib.urlencode({
                'geometry': point,
                'name': name,
                'caption': caption,
                'tags': 'cats dogs',
                'video_id': '111111',
                'video_provider': 'vimeo',
                'project_id': self.project.id,
                'owner': 'tester',
                'attribution': 'van gogh'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get("name"), name)
        self.assertEqual(response.data.get("caption"), caption)
        self.assertEqual(response.data.get("tags"), ['cats dogs'])
        self.assertEqual(response.data.get("video_id"), '111111')
        self.assertEqual(response.data.get("video_provider"), 'vimeo')
        self.assertEqual(response.data.get("project_id"), self.project.id)
        self.assertEqual(response.data.get("owner"), 'tester')
        self.assertEqual(response.data.get("attribution"), 'van gogh')


class ApiVideoInstanceTest(test.TestCase, ViewMixinAPI):
    '''
    Todo:
        * ensure that DELETE works
           - issues a delete request,
           - then do a get and make sure it's gone
        * PATCH: ensure that only the field you patch gets
          changed (nothing gets nulled out inadvertently)
    '''

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=True)
        self.video = self.create_video(self.user, self.project)
        self.url = '/api/0/videos/%s/.json' % self.video.id
        self.urls = [self.url]
        self.view = views.VideoInstance.as_view()
        self.metadata = get_metadata()

    def test_required_params_using_put(self, **kwargs):
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'video_id': '344533',
                'video_provider': 'youtube',
                'project_id': self.project.id
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_video = models.Video.objects.get(id=self.video.id)
        self.assertEqual(updated_video.video_id, '344533')
        self.assertEqual(updated_video.provider, 'youtube')
        self.assertEqual(updated_video.project, self.project)
        self.assertEqual(updated_video.owner, self.user)
        self.assertEqual(updated_video.last_updated_by, self.user)

    def test_throws_friendly_error_if_no_video_id_put(self, **kwargs):
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'video_provider': 'youtube',
                'project_id': self.project.id
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        # print response.data
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('video_id')[0], u'This field is required.'
        )

    def test_throws_friendly_error_if_no_video_provider_put(self, **kwargs):
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'video_id': '344533',
                'project_id': self.project.id
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        # print response.data
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get('video_provider')
                         [0], u'This field is required.')

    def test_throws_error_if_video_provider_invalid_put(self, **kwargs):
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'video_provider': 'samsclub',
                'project_id': self.project.id,
                'video_id': '35234'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get('video_provider')[
                         0], u'"samsclub" is not a valid choice.')

    def test_throws_friendly_error_if_no_project_put(self, **kwargs):
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'video_id': '344533',
                'video_provider': 'youtube'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        # print response.data
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get('project_id')
                         [0], u'This field is required.')

    def test_throws_error_if_project_id_invalid_type_put(self, **kwargs):
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'video_id': '344533',
                'video_provider': 'youtube',
                'project_id': 'happydays'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        # print response.data
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('project_id')[0],
            u'Incorrect type. Expected pk value, received unicode.'
        )

    def test_throws_error_if_project_id_invalid_put(self, **kwargs):
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'video_id': '344533',
                'video_provider': 'youtube',
                'project_id': 10000
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        # print response.data
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get('project_id')
                         [0], u'Invalid pk "10000" - object does not exist.')

    def test_update_video_using_put(self, **kwargs):
        name, caption = 'New Video Name', 'Test description'
        point = {
            "type": "Point",
            "coordinates": [12.492324113849, 41.890307434153]
        }
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'geometry': point,
                'name': name,
                'caption': caption,
                'tags': '',
                'video_id': '344533',
                'video_provider': 'vimeo',
                'project_id': self.project.id
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_video = models.Video.objects.get(id=self.video.id)
        self.assertEqual(updated_video.name, name)
        self.assertEqual(updated_video.description, caption)
        self.assertEqual(response.data.get("caption"), caption)
        self.assertEqual(updated_video.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_video.geometry.x, point['coordinates'][0])
        self.assertEqual(updated_video.video_id, '344533')
        self.assertEqual(updated_video.provider, 'vimeo')
        self.assertEqual(updated_video.owner, self.user)
        self.assertEqual(updated_video.last_updated_by, self.user)

    def test_update_video_using_patch(self, **kwargs):
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
        updated_video = models.Video.objects.get(id=self.video.id)
        self.assertEqual(updated_video.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_video.geometry.x, point['coordinates'][0])

    def test_update_video_using_patch_changes_patched_fields(self, **kwargs):
        import json
        point = {
            "type": "Point",
            "coordinates": [12.492324113849, 41.890307434153]
        }
        response = self.client_user.patch(
            self.url,
            data=urllib.urlencode({
                'geometry': point,
                'name': 'New Name',
                'caption': 'New Caption'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        # print response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_video = models.Video.objects.get(id=self.video.id)
        self.assertEqual(updated_video.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_video.geometry.x, point['coordinates'][0])
        self.assertEqual(updated_video.name, 'New Name')
        self.assertEqual(updated_video.description, 'New Caption')
        self.assertEqual(updated_video.video_id, '4232534')
        self.assertEqual(updated_video.provider, 'youtube')
        self.assertEqual(updated_video.owner, self.user)
        self.assertEqual(updated_video.last_updated_by, self.user)

    def test_delete_video(self, **kwargs):
        video_id = self.video.id
        # ensure video exists:
        models.Video.objects.get(id=video_id)

        # delete video:
        response = self.client_user.delete(
            self.url, HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # check to make sure it's gone:
        try:
            models.Video.objects.get(id=video_id)
            # throw assertion error if video still in database
            print 'Video not deleted'
            self.assertEqual(1, 0)
        except models.Video.DoesNotExist:
            # trigger assertion success if video is removed
            self.assertEqual(1, 1)

# handle crazy data "This video does not exist",
# "Video ID is in the incorrect format"
