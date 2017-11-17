from localground.apps.site.tests import ModelMixin
from localground.apps.site.models import PointMixin
from django import test
from localground.apps.site import models


class PointMixinTest(ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_point_model_properties(self):
        from django.contrib.gis.db import models
        prop_name = 'point'
        prop_type = models.PointField
        field = PointMixin._meta.get_field(prop_name)
        self.assertEqual(field.name, prop_name)
        self.assertEqual(type(field), prop_type)

    def test_point_mixin_geometry(self):
        point = 'POINT(-96.876369 29.905320)'
        self.model.point = point
        self.assertEqual(self.model.geometry, self.model.point)

    def test_point_display_coords(self):
        self.model.remove_latlng(self.user)
        self.assertEqual(self.model.display_coords(), '(?, ?)')
        point = 'POINT(-96.876369 29.905320)'
        self.model.point = point
        self.assertEqual(self.model.display_coords(), '(29.9053, -96.8764)')

    def test_point_update_latlng(self):
        point = 'POINT(-96.876369 29.905320)'
        self.model.point = point
        self.assertEqual(self.model.display_coords(), '(29.9053, -96.8764)')
        self.model.update_latlng(30.1234, -90.1234, self.user)
        self.assertEqual(self.model.display_coords(), '(30.1234, -90.1234)')  
        self.assertEqual(self.model.last_updated_by, self.user)   

    def test_point_remove_latlng(self):
        point = 'POINT(-96.876369 29.905320)'
        self.model.point = point
        self.model.remove_latlng(self.user)
        self.assertEqual(self.model.point, None)
        self.assertEqual(self.model.display_coords(), '(?, ?)')
        self.assertEqual(self.model.last_updated_by, self.user)   

        