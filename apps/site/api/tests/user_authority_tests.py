from django import test
from django.conf import settings
from localground.apps.site import models
from localground.apps.site.api import views
from rest_framework import status
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import json, os.path

def get_metadata():
    return {
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'user': {'read_only': False, 'required': True, 'type': 'field'},
        'authority': {'read_only': False, 'required': True, 'type': 'field'},
        'granted_by': {'read_only': True, 'required': False, 'type': 'field'},
        'object': {'read_only': True, 'required': False, 'type': 'field'},
    }

class UserAuthorityListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        # is this a hack? maybe
        self.view = views.UserAuthorityList.as_view()
        self.metadata = get_metadata()
        self.url = '/api/0/projects/' + str(self.project.id) + '/user-permissions/'
        self.urls = [self.url]

    def test_share_project_using_post(self, **kwargs):
        # create a second user & client
        from localground.apps.site.api.tests import Client
        random_user = self.create_user(username='rando')

        response = self.client_user.post(
            self.url,
            data=json.dumps({'object': self.project.id,
                            'user': random_user.id,
                            'granted_by': self.user.id,
                            'authority': 2}),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

