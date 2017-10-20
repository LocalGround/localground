from localground.apps.site.models import Project, BaseAudit
from django.contrib.gis.db import models
from django import test
from localground.apps.site.tests.models.abstract_base_audit_tests import \
    BaseAuditAbstractModelClassTest


class ProjectModelTest(BaseAuditAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAuditAbstractModelClassTest.setUp(self)
        self.model = self.create_project()

    def test_model_properties(self, **kwargs):
        self.assertTrue(hasattr(self.model, 'extents'))
        self.assertTrue(hasattr(self.model, 'slug'))
        extents = Project._meta.get_field('extents')
        slug = Project._meta.get_field('slug')
        self.assertTrue(isinstance(extents, models.PolygonField))
        self.assertTrue(isinstance(slug, models.CharField))

    def test_filter_fields_prop(self, **kwargs):
        test_fields = BaseAudit.filter_fields + \
            ('slug', 'name', 'description', 'tags')
        self.assertEqual(self.model.filter_fields, test_fields)
