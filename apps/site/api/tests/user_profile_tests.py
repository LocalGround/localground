import os, json
from django import test
from django.conf import settings
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.tests import ModelMixin
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class UserProfileTests(APITestCase, ModelMixin):
    def setUp(self):
        ModelMixin.setUp(self, load_fixtures=True)
        user = self.get_user()
        self.user_profile = models.UserProfile.objects.get(user_id=self.user.id)
        self.user.first_name = 'Lary'
        self.user.last_name = 'Grawl'
        self.user.email = 'test@bla.com'
        self.user.save()
        # create user profile attached to user

    def test_get_user_profile_list(self):
        url = reverse('userprofile-list') + ".json"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data['results']), 2)

    def test_get_user_profile(self):
        url = '/api/0/user-profile/%s/.json' % self.user_profile.id
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data.get('username'),'tester')
        self.assertEqual(data.get('first_name'), 'Lary')
        self.assertEqual(data.get('last_name'), 'Grawl')
        self.assertEqual(data.get('email'), 'test@bla.com')
        self.assertTrue('url' in data)
        self.assertTrue('time_stamp' in data)
        self.assertTrue('user' in data)
        self.assertTrue('date_created' in data)
        self.assertTrue('default_view_authority' in data)
        self.assertTrue('id' in data)
        self.assertTrue('default_location' in data)
        self.assertTrue(data.get('email_announcements'))

# test that we are unable to delete a user profile
    def test_delete_user_profile_fails(self):
        url = '/api/0/user-profile/%s/' % self.user_profile.id
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

# test that we are unable to create a user profile
    def test_create_user_profile_list_fails(self):
        url = '/api/0/user-profile/%s/' % self.user_profile.id
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
