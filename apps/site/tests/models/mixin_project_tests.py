from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models


class ProjectMixinTest(ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_dummy_project(self, **kwargs):
        self.assertEqual(1, 1)

    def test_hi_riley(self, **kwargs):
        self.assertEqual(1, 1)

    def test_hi_cynthia(self, **kwargs):
        self.assertEqual(1, 1)

    # set project, save, and make sure no errors
    def test_sets_project_correctly(self, **kwargs):
        project = self.create_project()
        self.model.project = project
        self.assertTrue(hasattr(self.model, 'project'))