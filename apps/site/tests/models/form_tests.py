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

    # Still need more to test...

    def get_filter_fields_test(self, **kwargs):
        # Looks like somehow it never reaches this assert
        # from attempting to retrieve query fields data
        query_fields_data = self.model.get_filter_fields()
        print(query_fields_data)
        self.assertEqual(1,0)

    def cache_dynamic_models_test(self, **kwargs):
        pass

    def clear_table_model_cache_test(self, **kwargs):
        pass

    def get_fields_test(self, **kwargs):
        # does not seem to reach self assert either
        formWithFields = self.create_form_with_fields()
        retrievedFields = formWithFields.get_fields()
        print(retrievedFields)
        self.assertEqual(1, 0)

    def get_model_class_test(self, **kwargs):
        pass

    def source_table_exists_test(self, **kwargs):
        pass

    def save_test(self, **kwargs):
        pass

    def delete_test(self, **kwargs):
        pass

    def remove_table_from_cache_test(self, **kwargs):
        pass
