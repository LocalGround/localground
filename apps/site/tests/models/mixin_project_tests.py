from localground.apps.site.tests import ModelMixin
from django import test
from django.contrib.auth.models import User
from localground.apps.site import models


class ProjectMixinTest(object):
    # set project, save, and make sure no errors
    def test_sets_project_correctly(self, **kwargs):
        project = self.create_project()
        self.model.project = project
        self.assertTrue(hasattr(self.model, 'project'))

    def test_project_can_view_method(self):
        # test_user = self.create_user()
        test_user = User.objects.create_user(
            username = 'Person 1',
            first_name='Person',
            email='',
            password = 'easy_password')

        # other user CANNOT view test
        self.assertFalse(self.model.can_view(test_user))

        # data owner CAN view test
        self.assertTrue(self.model.can_view(self.user))

        # make project public
        self.model.project.access_authority = models.ObjectAuthority.objects.get(id=3)
        # now other use CAN view test
        self.assertTrue(self.model.can_view(test_user))

    def test_project_can_edit_method(self):
        test_user = User.objects.create_user(
            username = 'Person 1',
            first_name='Person',
            email='',
            password = 'easy_password')

        # other user CANNOT edit test
        self.assertFalse(self.model.can_edit(test_user))

        # data owner CAN edit test
        self.assertTrue(self.model.can_edit(self.user))

        # add other user to group
        self.add_group_editor(self.model.project, test_user)

        # now other use CAN edit test
        self.assertTrue(self.model.can_edit(test_user))
