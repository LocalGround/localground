from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models


class NamedMixinTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_dummy_named(self):
        self.assertEqual(1, 1)
    
    def test_name_mixin_creates_props(self):
        self.assertTrue(hasattr(self.model, 'name'))
        self.assertTrue(hasattr(self.model, 'description'))
        self.assertTrue(hasattr(self.model, 'tags'))

        
