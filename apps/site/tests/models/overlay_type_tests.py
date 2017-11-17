from localground.apps.site.models import OverlayType
from django.conf import settings
from django.contrib.gis.db import models
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test


class OverlayTypeTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = OverlayType()
        self.object_type = 'overlay-type'
        self.model_name = 'overlay_type'
        self.pretty_name = 'overlay type'
        self.model_name_plural = 'overlay-types'
        self.pretty_name_plural = 'overlay types'

    # A streamlined approach to checking all the properties
    # from the class being tested on
    def test_model_properties(self):
        for prop in [
            ('name', models.CharField),
            ('description', models.TextField)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = self.model._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
