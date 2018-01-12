from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models
from localground.apps.site.models.abstract.mixins import ExtentsMixin


class ExtentsMixinTest(object):
    def test_extents_model_properties(self, **kwargs):
        from django.contrib.gis.db import models
        prop_name = 'extents'
        prop_type = models.PolygonField
        field = ExtentsMixin._meta.get_field(prop_name)
        self.assertEqual(field.name, prop_name)
        self.assertEqual(type(field), prop_type)

    def test_extent_geometry(self):
        self.model.extents = 'POLYGON(( 10 10, 10 20, 20 20, 20 15, 10 10))'
        print(self.model.geometry)
        print(self.model.extents)
        self.assertEqual(self.model.geometry, self.model.extents)

    def test_extent_remove_extents(self):
        self.model.extents = 'POLYGON(( 10 10, 10 20, 20 20, 20 15, 10 10))'
        self.assertEqual(self.model.geometry, self.model.extents)
        self.model.remove_extents(self.user)
        self.assertEqual(self.model.geometry, None)
        self.assertEqual(self.model.last_updated_by, self.user)
