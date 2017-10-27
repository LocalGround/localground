from localground.apps.site.models import Form
from localground.apps.site.models import Field

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
        self.assertEqual(
            query_fields_data['owner'].to_dict(),
            {
                'help_text': u'',
                'type': 'integer',
                'col_name': 'owner',
                'label': u'owner'
            })

        self.assertEqual(query_fields_data['date_created'].to_dict(),
            {
                'help_text': u'',
                'type': 'date',
                'col_name': 'date_created',
                'label': u'date created'
            })

        self.assertEqual(query_fields_data['id'].to_dict(),
            {
                'help_text': u'',
                'type': 'integer',
                'col_name': 'id',
                'label': u'ID'
            })

        self.assertEqual(query_fields_data['project'].to_dict(),
            {
                'help_text': 'Project to which the form belongs',
                'type': 'string',
                'col_name': 'project',
                'label': u'project'
            })

        self.assertEqual(query_fields_data['time_stamp'].to_dict(),
            {
                'help_text': u'',
                'type': 'date',
                'col_name': 'time_stamp',
                'label': u'time stamp'
            })

        pass

    def test_cache_dynamic_models(self, **kwargs):
        pass

    def test_clear_table_model_cache(self, **kwargs):
        pass

    def test_get_fields(self, **kwargs):
        formWithFields = self.create_form_with_fields(num_fields=9)
        retrievedFields = formWithFields.get_fields(print_only = True)
        self.assertEqual(9, len(retrievedFields))
        for field in retrievedFields:
            self.assertTrue(type(field) is Field)


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
