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
        # create user profile attached to user

    def test_get_user_profile_list(self):
        url = reverse('userprofile-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    def test_get_user_profile(self):
        url = '/api/0/user-profile/%s/' % self.user_profile.id
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

