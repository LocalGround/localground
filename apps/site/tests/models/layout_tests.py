from localground.apps.site.models import Layout

from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test


class LayoutTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = Layout()
        self.object_type = self.model_name = self.pretty_name = 'layout'
        self.model_name_plural = self.pretty_name_plural = 'layouts'

    # A streamlined approach to checking all the properties
    # from the class being tested on
    def test_model_properties(self, **kwargs):
        for prop in [
            ('name', models.CharField),
            ('display_name', models.CharField),
            ('map_width_pixels', models.IntegerField),
            ('map_height_pixels', models.IntegerField),
            ('qr_size_pixels', models.IntegerField),
            ('border_width', models.IntegerField),
            ('is_active', models.BooleanField),
            ('is_landscape', models.BooleanField),
            ('is_data_entry', models.BooleanField)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = Layout._meta.get_field(prop_name)
            self.assertEqual(
                field.name,
                prop_name
            )
            self.assertEqual(
                type(field),
                prop_type
            )
