from django import test
from django.conf import settings
from localground.apps.site import models
from localground.apps.site.api import views
from rest_framework import status
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from localground.apps.site.api.tests import Client
import json, os.path

def get_metadata():
    return {
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'authority': {'read_only': False, 'required': True, 'type': 'field'},
        'granted_by': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id':  {'type': 'integer', 'required': False, 'read_only': True }
    }

class UserAuthorityListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        # is this a hack? maybe
        self.view = views.UserPermissionsList.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            'user': {'read_only': False, 'required': True, 'type': 'field'}
        })
        self.url = '/api/0/projects/' + str(self.project.id) + '/user-permissions/'
        self.urls = [self.url]

    def test_share_project_using_post(self, **kwargs):
        # create a second user & client
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


class UserAuthorityInstanceTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.view = views.UserPermissionsInstance.as_view()
        self.metadata = get_metadata()
        self.random_user = self.create_user(username='rando')
        self.uao = self.grant_project_permissions_to_user(self.project, self.random_user)
        self.url = '/api/0/projects/%s/user-permissions/%s/' % (self.project.id, self.uao.id)
        self.urls = [self.url]

    def test_update_sharing_using_put(self, **kwargs):
        response = self.client_user.put(
        self.url,
        data=json.dumps({'object': self.project.id,
                        'user': self.random_user.id,
                        'granted_by': self.user.id,
                        'authority': 2}),
        HTTP_X_CSRFTOKEN=self.csrf_token,
        content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_sharing_using_patch(self, **kwargs):
        response = self.client_user.patch(
        self.url,
        data=json.dumps({'object': self.project.id,
                        'user': self.random_user.id,
                        'granted_by': self.user.id,
                        'authority': 3}),
        HTTP_X_CSRFTOKEN=self.csrf_token,
        content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_delete_sharing(self, **kwargs):
        response = self.client_user.delete(self.url,
                                           HTTP_X_CSRFTOKEN=self.csrf_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


