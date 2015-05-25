from django import test
from django.contrib.auth.models import AnonymousUser
from localground.apps.site import models
from localground.apps.site.tests import ModelMixin
from rest_framework import status
import urllib


class DataSecurityTest(test.TestCase, ModelMixin):

    fixtures = ['test_data.json'] #'initial_data.json', 

    def setUp(self):
        ModelMixin.setUp(self)
        self.groups = [
            self.project,
            self.create_view(self.user)
        ]

    def test_owner_can_manage(self):
        for group in self.groups:
            self.assertTrue(group.can_manage(self.user))
