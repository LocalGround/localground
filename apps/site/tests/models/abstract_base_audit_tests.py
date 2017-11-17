from localground.apps.site.tests import ModelMixin
from localground.apps.site import models
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest


class BaseAuditAbstractModelClassTest(BaseAbstractModelClassTest):
    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)

    def test_filter_fields_set_correctly_for_baseaudit_abstract_class(
            self, **kwargs):
        test_fields = ('id', 'date_created', 'time_stamp', 'owner')
        self.assertEqual(models.BaseAudit.filter_fields, test_fields)

    def test_get_filter_fields_returns_correct_query_fields_dict(
            self, **kwargs):
        test_keys = ['owner', 'date_created', 'time_stamp']
        self.assertEqual(
            models.BaseAudit.get_filter_fields().keys(), test_keys
        )

    def test_base_audit_model_properties(self):
        from django.contrib.gis.db import models
        from localground.apps.site.models import BaseAudit
        for prop in [
            ('owner', models.ForeignKey),
            ('last_updated_by', models.ForeignKey),
            ('date_created', models.DateTimeField),
            ('time_stamp', models.DateTimeField),
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = BaseAudit._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
