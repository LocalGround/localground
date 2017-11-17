from localground.apps.site.models import Project, BaseAudit
from localground.apps.site.managers import ProjectManager
from django.contrib.gis.db import models
from django import test
from localground.apps.site.tests.models.abstract_base_audit_tests import \
    BaseAuditAbstractModelClassTest
from localground.apps.site.tests.models import NamedMixinTest, \
    ObjectPermissionsMixinTest, GenericRelationMixinTest


# TODO: Include other mixins when ready
class ProjectModelTest(NamedMixinTest, GenericRelationMixinTest, ObjectPermissionsMixinTest, BaseAuditAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAuditAbstractModelClassTest.setUp(self)
        self.model = self.create_project()
        self.object_type = self.model_name = self.pretty_name = 'project'
        self.model_name_plural = self.pretty_name_plural = 'projects'

    def test_model_properties(self):
        self.assertTrue(hasattr(self.model, 'extents'))
        self.assertTrue(hasattr(self.model, 'slug'))
        extents = Project._meta.get_field('extents')
        slug = Project._meta.get_field('slug')
        self.assertTrue(isinstance(extents, models.PolygonField))
        self.assertTrue(isinstance(slug, models.CharField))

    def test_filter_fields_prop(self):
        test_fields = BaseAudit.filter_fields + \
            ('slug', 'name', 'description', 'tags')
        self.assertEqual(self.model.filter_fields, test_fields)

    def test_check_project_objects_manager(self, **kwargs):
        self.assertTrue(hasattr(Project, 'objects'))
        self.assertTrue(isinstance(Project.objects, ProjectManager))
