from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models


class MediaMixinTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_dummy_media(self, **kwargs):
        self.assertEqual(1, 1)
