from localground.apps.site.models import Layout

from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test

class LayoutTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = Layout()

    def test_dummy(self, **kwargs):
        pass


    def test_model_properties(self, **kwargs):
        self.assertTrue(hasattr(self.model, 'name'))
        self.assertTrue(hasattr(self.model, 'description'))
        name = StatusCode._meta.get_field("name")
        description = StatusCode._meta.get_field("description")
        self.assertTrue(isinstance(name, models.CharField))
        self.assertTrue(isinstance(description, models.CharField))
