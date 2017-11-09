from localground.apps.site.models import Form
from localground.apps.site.models import Field

from django.contrib.gis.db import models
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from localground.apps.site.tests.models import ProjectMixinTest, NamedMixinTest
from django import test


# form test in progress
class FormTest(NamedMixinTest, ProjectMixinTest, BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = self.create_form()
        self.object_type = self.model_name = self.pretty_name = 'form'
        self.model_name_plural = self.pretty_name_plural = 'forms'

    def test_get_filter_fields(self, **kwargs):

        # this one contains a dictionary of information
        # related to the form
        formWithFields = self.create_form_with_fields()
        query_fields_data = formWithFields.get_filter_fields()
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

    def test_get_fields(self, **kwargs):
        formWithFields = self.create_form_with_fields(num_fields=9)
        retrievedFields = formWithFields.get_fields(print_only = True)
        self.assertEqual(9, len(retrievedFields))
        for field in retrievedFields:
            self.assertTrue(type(field) is Field)
