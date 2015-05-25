from django import test
from django.contrib.auth.models import AnonymousUser
from localground.apps.site import models
from localground.apps.site.tests import ModelMixin
from rest_framework import status
import urllib


class GroupManageSecurityTest(test.TestCase, ModelMixin):

    fixtures = ['test_data.json'] #'initial_data.json', 

    def setUp(self):
        ModelMixin.setUp(self)
        self.groups = [
            self.project,
            self.create_snapshot(self.user),
            self.create_form_with_fields()
        ]

    def test_owner_can_manage(self):
        for group in self.groups:
            self.assertTrue(group.can_manage(self.user))

    def test_managers_can_manage(self):
        u = self.create_user(username='mgr')
        for group in self.groups:
            self.add_group_manager(group, u)
            self.assertTrue(group.can_manage(u))

    def test_editors_cannot_manage(self):
        u = self.create_user(username='mgr')
        for group in self.groups:
            self.add_group_editor(group, u)
            self.assertFalse(group.can_manage(u))

    def test_viewers_cannot_manage(self):
        u = self.create_user(username='mgr')
        for group in self.groups:
            self.add_group_viewer(group, u)
            self.assertFalse(group.can_manage(u))

    def test_anonymous_users_cannot_manage(self):
        for group in self.groups:
            self.assertFalse(group.can_manage(AnonymousUser()))

    def test_random_users_cannot_manage(self):
        u = self.create_user(username='random')
        for group in self.groups:
            self.assertFalse(group.can_manage(u))


class GroupEditSecurityTest(test.TestCase, ModelMixin):

    fixtures = ['test_data.json'] #'initial_data.json',
    
    def setUp(self):
        ModelMixin.setUp(self)
        self.groups = [
            self.project,
            self.create_snapshot(self.user),
            self.create_form_with_fields()
        ]

    def test_owner_can_edit(self):
        for group in self.groups:
            self.assertTrue(group.can_edit(self.user))

    def test_managers_can_edit(self):
        u = self.create_user(username='mgr')
        for group in self.groups:
            self.add_group_manager(group, u)
            self.assertTrue(group.can_edit(u))

    def test_editors_can_edit(self):
        u = self.create_user(username='mgr')
        for group in self.groups:
            self.add_group_editor(group, u)
            self.assertTrue(group.can_edit(u))

    def test_viewers_cannot_edit(self):
        u = self.create_user(username='mgr')
        for group in self.groups:
            self.add_group_viewer(group, u)
            self.assertFalse(group.can_edit(u))

    def test_anonymous_users_cannot_edit(self):
        for group in self.groups:
            self.assertFalse(group.can_edit(AnonymousUser()))

    def test_random_users_cannot_edit(self):
        u = self.create_user(username='random')
        for group in self.groups:
            self.assertFalse(group.can_edit(u))


class GroupViewSecurityTest(test.TestCase, ModelMixin):

    fixtures = ['test_data.json'] #'initial_data.json', 

    def setUp(self):
        ModelMixin.setUp(self)
        self.key = 'r3VqnUjxIUI245ns'
        self.groups = [
            self.project,
            self.create_snapshot(self.user),
            self.create_form_with_fields()
        ]

    def test_owner_can_view(self):
        for group in self.groups:
            self.assertTrue(group.can_edit(self.user))

    def test_managers_can_view(self):
        u = self.create_user(username='mgr')
        for group in self.groups:
            self.add_group_manager(group, u)
            self.assertTrue(group.can_view(u))

    def test_editors_can_view(self):
        u = self.create_user(username='mgr')
        for group in self.groups:
            self.add_group_editor(group, u)
            self.assertTrue(group.can_view(u))

    def test_viewers_can_view(self):
        u = self.create_user(username='mgr')
        for group in self.groups:
            self.add_group_viewer(group, u)
            self.assertTrue(group.can_view(u))

    def test_anonymous_users_cannot_view_private_objects(self):
        for group in self.groups:
            # just checking both ways of calling method once...
            self.assertFalse(group.can_view(AnonymousUser()))
            self.assertFalse(group.can_view(user=AnonymousUser()))

    def test_random_users_cannot_view_private_objects(self):
        u = self.create_user(username='random')
        for group in self.groups:
            self.assertFalse(group.can_view(u))

    def test_anyone_can_view_public_objects(self):
        oa = models.ObjectAuthority.objects.get(
            id=models.ObjectAuthority.PUBLIC
        )
        for group in self.groups:
            group.access_authority = oa
            group.save()
            self.assertTrue(group.can_view(user=AnonymousUser()))
            self.assertTrue(group.can_view())

    def test_anyone_can_view_protected_objects_with_key(self):
        oa = models.ObjectAuthority.objects.get(
            id=models.ObjectAuthority.PUBLIC_WITH_LINK
        )
        for group in self.groups:
            group.access_authority = oa
            group.access_key = self.key
            group.save()
            self.assertTrue(group.can_view(access_key=self.key))

    def test_anyone_cannot_view_protected_objects_without_key(self):
        oa = models.ObjectAuthority.objects.get(
            id=models.ObjectAuthority.PUBLIC_WITH_LINK
        )
        for group in self.groups:
            group.access_authority = oa
            group.access_key = self.key
            group.save()
            self.assertFalse(group.can_view(AnonymousUser()))
