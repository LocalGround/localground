from rest_framework.test import APITestCase, APIClient
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
        'authority': {'read_only': False, 'required': True, 'type': 'field'},
        'granted_by': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id':  {'type': 'integer', 'required': False, 'read_only': True }
    }

class SharingListTest(APITestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        # is this a hack? maybe
        self.view = views.SharingList.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            'user': {'read_only': False, 'required': True, 'type': 'field'}
        })
        self.url = '/api/0/projects/' + str(self.project.id) + '/users/.json'
        self.urls = [self.url]

    def _add_user(self, auth_user, user, authority):
        self.client.force_authenticate(user=auth_user)
        return self.client.post(self.url,
            data=json.dumps({
                'user': user.id,
                'authority': authority
            }),
            content_type="application/json"
        )

    def _get_users(self, auth_user):
        self.client.force_authenticate(user=auth_user)
        return self.client.get(self.url)

    def test_sharing_list_view_permissions(self, **kwargs):
        # create new user and make them project manager:
        manager = self.create_user(username='manager')
        editor = self.create_user(username='editor')
        viewer = self.create_user(username='viewer')
        nobody = self.create_user(username='nobody')
        self._add_user(self.user, manager, 3)
        self._add_user(self.user, editor, 2)
        self._add_user(self.user, viewer, 1)

        # test manager can see 2 users:
        response = self._get_users(manager)
        data = json.loads(response.content)
        self.assertEqual(len(data.get('results')), 3)

        # test editor can see 2 users:
        response = self._get_users(editor)
        data = json.loads(response.content)
        self.assertEqual(len(data.get('results')), 3)

        # test viewer can only see themselves:
        response = self._get_users(viewer)
        data = json.loads(response.content)
        self.assertEqual(len(data.get('results')), 1)

        # test unauthorized user cannot see list:
        response = self._get_users(nobody)
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)  

    def test_owner_can_share_project_using_post(self, **kwargs):
        # create a second user & client
        random_user = self.create_user(username='rando')
        response = self._add_user(self.user, random_user, 2)

        # check that data saved correctly:
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = json.loads(response.content)
        self.assertEqual(data.get('user'), random_user.id)
        self.assertEqual(data.get('project_id'), self.project.id)
        self.assertEqual(data.get('granted_by'), self.user.id)
        self.assertEqual(data.get('authority'), 2)
        
    def test_manager_can_share_project_using_post(self, **kwargs):
        # create a manager:
        manager = self.create_user(username='manager')
        response = self._add_user(self.user, manager, 3)

        # ensure that manager can share w/new ppl:
        random_user = self.create_user(username='rando')
        response = self._add_user(manager, random_user, 2)
    
    def test_unauthorized_user_cannot_share_project_using_post(self, **kwargs):
        # create a second user & client
        not_owner = self.create_user(username='not_owner')
        random_user = self.create_user(username='rando')
        response = self._add_user(not_owner, random_user, 2)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_cannot_share_with_same_user_twice(self, **kwargs):
        # share w/random user:
        random_user = self.create_user(username='rando')
        response = self._add_user(self.user, random_user, 2)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # if share w/same random user again, then bad request:
        response = self._add_user(self.user, random_user, 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class SharingInstanceTest(APITestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.client = APIClient(enforce_csrf_checks=True)
        self.view = views.SharingInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            'user': {'read_only': True, 'required': False, 'type': 'field'}
        })
        self.random_user = self.create_user(username='rando')
        self.uao = self.grant_project_permissions_to_user(self.project, self.random_user, authority_id=1)
        self.url = '/api/0/projects/%s/users/%s/.json' % (self.project.id, self.uao.user.id)
        self.urls = [self.url]

    def _update_user_put(self, auth_user, authority):
        self.client.force_authenticate(user=auth_user)
        return self.client.put(self.url,
            data=json.dumps({
                'authority': authority
            }),
            content_type="application/json"
        )
    def _update_user_patch(self, auth_user, authority):
        self.client.force_authenticate(user=auth_user)
        return self.client.patch(self.url,
            data=json.dumps({
                'authority': authority
            }),
            content_type="application/json"
        )
    def _delete_user(self, auth_user):
        self.client.force_authenticate(user=auth_user)
        return self.client.delete(self.url)

    def test_update_sharing_using_put(self, **kwargs):
        response = self._update_user_put(self.user, 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data.get('authority'), 2)

        unauthorized_user = self.create_user(username='unauthorized')
        response = self._update_user_put(unauthorized_user, 2)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_sharing_using_patch(self, **kwargs):
        response = self._update_user_put(self.user, 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data.get('authority'), 2)

        unauthorized_user = self.create_user(username='unauthorized')
        response = self._update_user_put(unauthorized_user, 2)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_manager_can_update_sharing_for_another_user(self, **kwargs):
        # create a manager:
        manager = self.create_user(username='manager')
        self.grant_project_permissions_to_user(self.project, manager, authority_id=3)

        # update current authority by project manager:
        response = self._update_user_put(manager, 2)
        data = json.loads(response.content)
        self.assertEqual(data.get('authority'), 2)

    def test_delete_sharing(self, **kwargs):
        unauthorized_user = self.create_user(username='unauthorized')
        response = self._delete_user(unauthorized_user)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        response = self._delete_user(self.user)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_can_always_unshare_project_with_oneself(self, **kwargs):
        # make sure that user can delete oneself:
        self.uao.authority = models.UserAuthority.objects.get(id=1)
        self.uao.save()
        response = self._delete_user(self.uao.user)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_user_can_downgrade_not_upgrade_oneself(self, **kwargs):
        self.uao.authority = models.UserAuthority.objects.get(id=2)
        self.uao.save()
        response = self._update_user_put(self.uao.user, 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data.get('authority'), 1)



