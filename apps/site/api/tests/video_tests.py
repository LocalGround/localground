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
        'video_link': {'read_only': False, 'required': True, 'type': 'string'},
        'video_id': {'read_only': True, 'required': False, 'type': 'string'},
        'video_provider': {'read_only': True, 'required': False,
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
            name="YT"
        )
        self.create_video(
            self.user, self.project,
            name="Vim",
            video_link='https://vimeo.com/256931635')
        self.view = views.VideoList.as_view()
        self.metadata = get_metadata()

    def test_page_500_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_user.get(url)
            self.assertEqual(response.status_code,
                status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        url = '/api/0/videos/?project_id={0}'.format(self.project.id)
        response = self.client_user.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    '''
    Todo:
        * ensure that POST only creates new videos when required
          parameters are included
        * ensure that POST updates all DB fields when all params are specified
    '''

    def test_video_list_returns_all_videos(self, **kwargs):
        response = self.client_user.get(
            self.url + '?project_id={0}'.format(self.project.id)
        )
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
                'video_link': 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
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
        self.assertEqual(response.data.get("video_id"), 'jNQXAC9IVRw')
        self.assertEqual(response.data.get("video_provider"), 'youtube')
        self.assertEqual(response.data.get("video_link"), 'https://www.youtube.com/watch?v=jNQXAC9IVRw')
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
        self.video = self.create_video(
            self.user, self.project,
            name="Vim",
            video_link='https://vimeo.com/256931635')
        self.url = '/api/0/videos/%s/.json' % self.video.id
        self.urls = [self.url]
        self.view = views.VideoInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            'video_link': {
                'read_only': True, 'required': False, 'type': 'string'},
            'project_id': {
                'read_only': True, 'required': False, 'type': 'field'}
        })

    def test_required_params_using_put(self, **kwargs):
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'caption': 'My video',
                'attribution': 'Phil',
                #'project_id': self.project.id
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_video = models.Video.objects.get(id=self.video.id)
        self.assertEqual(updated_video.description, 'My video')
        self.assertEqual(updated_video.attribution, 'Phil')

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
                'tags': ''
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
