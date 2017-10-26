from localground.apps.site.models import Form

from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_bases import \
    BaseAbstractModelClassTest
from django import test


# form test in progress
class FormTest(test.TestCase):

    #def setUp(self):
    #    BaseAbstractModelClassTest.setUp(self)
        #self.model = self.create_form()

    # Still need more to test...

    def test_get_filter_fields(self, **kwargs):
        # Looks like somehow it never reaches this assert
        # from attempting to retrieve query fields data
        #query_fields_data = self.model.get_filter_fields()
        #print(query_fields_data)
        self.assertEqual(1,0)

'''
    def test_cache_dynamic_models(self, **kwargs):
        pass

    def test_clear_table_model_cache(self, **kwargs):
        pass

    def test_get_fields(self, **kwargs):
        # does not seem to reach self assert either
        formWithFields = self.create_form_with_fields()
        retrievedFields = formWithFields.get_fields()
        print(retrievedFields)
        self.assertEqual(1, 0)

    def test_get_model_class(self, **kwargs):
        pass

    def test_source_table_exists(self, **kwargs):
        pass

    def test_save(self, **kwargs):
        pass

    def test_delete(self, **kwargs):
        pass

    def test_remove_table_from_cache(self, **kwargs):
        pass
'''
