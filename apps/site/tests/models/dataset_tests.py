from localground.apps.site.models import Dataset
from localground.apps.site.models import Field

from django.contrib.gis.db import models
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from localground.apps.site.tests.models.abstract_base_audit_tests import \
    BaseAuditAbstractModelClassTest
from localground.apps.site.tests.models import ProjectMixinTest, NamedMixinTest
from django import test


# dataset test in progress
class DatasetTest(
        NamedMixinTest, ProjectMixinTest, BaseAuditAbstractModelClassTest,
        test.TestCase):

    def setUp(self):
        BaseAuditAbstractModelClassTest.setUp(self)
        self.model = self.create_dataset()
        self.object_type = self.model_name = self.pretty_name = 'dataset'
        self.model_name_plural = self.pretty_name_plural = 'datasets'

    def test_get_filter_fields(self, **kwargs):

        # this one contains a dictionary of information
        # related to the dataset
        formWithFields = self.create_dataset_with_fields()
        query_fields_data = formWithFields.get_filter_fields()
        self.assertEqual(
            query_fields_data['owner'].to_dict(),
            {
                'help_text': u'',
                'type': 'integer',
                'col_name': 'owner',
                'label': u'owner'
            })

        self.assertEqual(
            query_fields_data['date_created'].to_dict(),
            {
                'help_text': u'',
                'type': 'date',
                'col_name': 'date_created',
                'label': u'date created'
            })

        self.assertEqual(
            query_fields_data['id'].to_dict(),
            {
                'help_text': u'',
                'type': 'integer',
                'col_name': 'id',
                'label': u'ID'
            })

        self.assertEqual(
            query_fields_data['project'].to_dict(),
            {
                'help_text': 'Project to which the dataset belongs',
                'type': 'string',
                'col_name': 'project',
                'label': u'project'
            })

        self.assertEqual(
            query_fields_data['time_stamp'].to_dict(),
            {
                'help_text': u'',
                'type': 'date',
                'col_name': 'time_stamp',
                'label': u'time stamp'
            })

    def test_dataset_throws_error_if_dependent_layers(self, **kwargs):
        self.create_styled_map(dataset=self.model)

        # if there is already a layer depending on this dataset,
        # don't remove it
        with self.assertRaises(Exception):
            self.model.delete()
