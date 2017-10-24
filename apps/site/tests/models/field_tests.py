from localground.apps.site.models import Field
from localground.apps.site.models import DataType

from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test


# form test in progress
class FieldTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = Field()
        self.model.col_name_db = "test_col"
        self.model.col_alias = "test column"
        # how to properly set datatype with one type?

    # Still need more to test...
    def test_get_class(self, **kwargs):
        print(self.model)
        self.assertEqual(1,0)
