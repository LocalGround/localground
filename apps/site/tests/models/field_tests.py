from localground.apps.site.models import Field
from localground.apps.site.models import DataType

from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_base_audit_tests import \
    BaseAuditAbstractModelClassTest
from django import test


# dataset test in progress
class FieldTest(BaseAuditAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAuditAbstractModelClassTest.setUp(self)
        self.model = Field()
        self.model.col_name_db = "test_col"
        self.model.col_alias = "test column"
        self.object_type = self.model_name = self.pretty_name = 'field'
        self.model_name_plural = self.pretty_name_plural = 'fields'

    # skip the following for now: can_view, can_edit, can_manage for now

    def test_to_dict(self, **kwargs):
        # again, I am testing a dictionary without a datatype set
        # therefore the ID would be None
        dictTest = self.model.to_dict()
        self.assertEqual(dictTest['id'], None)
        self.assertEqual(dictTest['alias'], 'test column')

    def test_toJSON(self, **kwargs):
        jsonTest = self.model.toJSON()
        self.assertEqual(jsonTest['id'], None)
        self.assertEqual(jsonTest['ordering'], None)
        self.assertEqual(jsonTest['col_name'], 'test_column')
        self.assertEqual(jsonTest['col_alias'], 'test column')


    def test_col_name(self, **kwargs):
        col_name_str = self.model.col_name
        self.assertEqual(col_name_str, 'test_column')
