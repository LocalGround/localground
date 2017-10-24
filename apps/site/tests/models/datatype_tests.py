from localground.apps.site.models import DataType
from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test


# DataType test in progress
class DataTypeTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = DataType()

    # Still need more to test...

    def test_datatype_enum(self, **kwargs):
        self.assertEqual(DataType.DataTypes.TEXT, 1)
        self.assertEqual(DataType.DataTypes.INTEGER, 2)
        self.assertEqual(DataType.DataTypes.DATETIME, 3)
        self.assertEqual(DataType.DataTypes.BOOLEAN, 4)
        self.assertEqual(DataType.DataTypes.DECIMAL, 5)
        self.assertEqual(DataType.DataTypes.RATING, 6)
        self.assertEqual(DataType.DataTypes.CHOICE, 7)
        self.assertEqual(DataType.DataTypes.PHOTO, 8)
        self.assertEqual(DataType.DataTypes.AUDIO, 9)

    def test_model_properties(self, **kwargs):
        self.assertTrue(hasattr(self.model, 'name'))
        self.assertTrue(hasattr(self.model, 'sql'))
        name = DataType._meta.get_field("name")
        sql = DataType._meta.get_field("sql")
        self.assertTrue(isinstance(name, models.CharField))
        self.assertTrue(isinstance(sql, models.CharField))

    def test_to_dict(self, **kwargs):
        # by default, the datatype without a set value
        # will print out empty information
        testDict = self.model.to_dict()
        self.assertEqual(testDict['id'], None)
        self.assertEqual(testDict['name'], u'')
        self.assertEqual(testDict['sql'], u'')
