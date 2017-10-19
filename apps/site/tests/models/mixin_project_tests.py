from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models


class ProjectMixinTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_dummy_project(self, **kwargs):
        self.assertEqual(1, 1)

    def test_hi_riley(self, **kwargs):
        self.assertEqual(1, 1)

    def test_hi_cynthia(self, **kwargs):
        self.assertEqual(1, 1)
