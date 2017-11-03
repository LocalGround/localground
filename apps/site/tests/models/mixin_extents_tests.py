from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models
from localground.apps.site.models.abstract.mixins import ExtentsMixin


class ExtentsMixinTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_dummy_extents(self, **kwargs):
        self.assertEqual(1, 1)

    def test_model_properties(self, **kwargs):
        from django.contrib.gis.db import models
        from localground.apps.site.models import BaseUploadedMedia
        prop_name = 'extents'
        prop_type = models.PolygonField
        field = ExtentsMixin._meta.get_field(prop_name)
        self.assertEqual(field.name, prop_name)
        self.assertEqual(type(field), prop_type)