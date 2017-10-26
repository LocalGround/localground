from localground.apps.site.models import Form
from django.contrib.gis.db import models
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test


# form test in progress
class FormTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = self.create_form()

    def test_get_filter_fields(self, **kwargs):

        # this one contains a dictionary of information
        # related to the form
        formWithFields = self.create_form_with_fields()
        query_fields_data = formWithFields.get_filter_fields()
        print(query_fields_data)
        self.assertEqual(1, 0)

    def test_cache_dynamic_models(self, **kwargs):
        self.assertEqual(1, 0)

    def test_clear_table_model_cache(self, **kwargs):
        self.assertEqual(1, 0)

    def test_get_fields(self, **kwargs):
        # So this one does not contain names inside fields
        # formWithFields = self.create_form_with_fields()
        # retrievedFields = formWithFields.get_fields()
        # print(retrievedFields)
        self.assertEqual(1, 0)

    def test_get_model_class(self, **kwargs):
        self.assertEqual(1, 0)

    def test_source_table_exists(self, **kwargs):
        self.assertEqual(1, 0)

    def test_save(self, **kwargs):
        self.assertEqual(1, 0)

    def test_delete(self, **kwargs):
        self.assertEqual(1, 0)

    def test_remove_table_from_cache(self, **kwargs):
        self.assertEqual(1, 0)
