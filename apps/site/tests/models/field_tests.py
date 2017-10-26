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

    # skip the following for now: can_view, can_edit, can_manage for now

    def test_to_dict(self, **kwargs):
        # again, I am testing a dictionary without a datatype set
        # therefore the ID would be None
        dictTest = self.model.to_dict()
        print(dictTest)
        self.assertEqual(dictTest['id'], None)
        self.assertEqual(dictTest['alias'], 'test column')
        #
        # self.assertEqual(testDict['sql'], u'')

    def test_toJSON(self, **kwargs):
        jsonTest = self.model.toJSON()
        print(jsonTest)
        self.assertEqual(jsonTest['id'], None)
        self.assertEqual(jsonTest['ordering'], None)
        self.assertEqual(jsonTest['col_name'], 'test_column')
        self.assertEqual(jsonTest['col_alias'], 'test column')
        # self.assertEqual(jsonTest['alias'], 'test column')


    def test_col_name(self, **kwargs):
        col_name_str = self.model.col_name
        print(col_name_str)
        self.assertEqual(1, 0)
        pass

    def test_save(self, **kwargs):
        pass

    def test_add_column_to_table(self, **kwargs):
        pass
