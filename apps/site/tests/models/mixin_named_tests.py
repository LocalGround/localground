from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models


class NamedMixinTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_dummy_named(self, **kwargs):
        self.assertEqual(1, 1)
