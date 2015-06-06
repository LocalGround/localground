from django import test
from django.contrib.auth.models import AnonymousUser
from localground.apps.site import models
from localground.apps.site.models import FormUser, UserAuthorityObject
from localground.apps.site.managers.base import GenericLocalGroundError
from localground.apps.site.tests import ModelMixin
from rest_framework import status
import urllib


class BatchQueryGroupMixin(ModelMixin):
    model = models.Group

    def setUp(self):
        # to set up this test, we'll create 2 forms that that
        # are owned by self.owner.  A unique, private project
        # will be assigned to each form.

        ModelMixin.setUp(self, load_fixtures=False)

        # create 3 users:
        self.users = [self.create_user(username=u)
                      for u in ['u1', 'u2', 'u3']]
        self.owner = self.users[0]
        self.user1 = self.users[1]
        self.user2 = self.users[2]

        # create 2 groups:
        self._create_groups()
        
    def tearDown(self):
        models.Form.objects.all().delete()

    def _debug(self):
        fus = FormUser.objects.filter(form=self.group1)
        for fu in fus:
            print fu.form.id, fu.user, fu.user_authority
        print '*' * 50

        uaos = UserAuthorityObject.objects.all()
        for uao in uaos:
            print uao.object_id, self.group1.id, uao.content_type, self.group1.get_content_type(), uao.user
        print '*' * 50

    def test_owner_can_view_objects(self):
        # Both forms are owned by self.owner
        self.assertEqual(
            2,
            len(self.model.objects.get_objects(self.owner))
        )

    def test_owner_can_edit_objects(self):
        self.assertEqual(
            2,
            len(self.model.objects.get_objects_editable(self.owner))
        )

    def test_anonymous_cannot_view_objects(self):
        allows_query = True
        try:
            self.model.objects.get_objects(AnonymousUser())
        except GenericLocalGroundError:
            allows_query = False
        self.assertFalse(allows_query)

    def test_viewer_can_view_objects(self):
        # grant user2 direct access to group1
        self.add_group_viewer(self.group1, self.user2)

        # user2 should be able to view 1 forms....
        self.assertEqual(
            1,
            len(self.model.objects.get_objects(self.user2))
        )
        # user2 should only be able to edit 0 form...
        self.assertEqual(
            0,
            len(self.model.objects.get_objects_editable(self.user2))
        )

    def test_anonymous_cannot_edit_objects(self):
        allows_query = True
        try:
            self.model.objects.get_objects_editable(AnonymousUser())
        except GenericLocalGroundError:
            allows_query = False
        self.assertFalse(allows_query)

    def test_editor_can_view_and_edit_objects(self):
        # grant user2 direct access to group1
        self.add_group_editor(self.group1, self.user2)

        # user2 should be able to view 1 form....
        self.assertEqual(
            1,
            len(self.model.objects.get_objects(self.user2))
        )
        # user2 should only be able to edit 1 form...
        self.assertEqual(
            1,
            len(self.model.objects.get_objects_editable(self.user2))
        )

    def test_manager_can_view_and_edit_objects(self):
        # grant user2 direct access to group1
        self.add_group_manager(self.group1, self.user2)

        # user2 should be able to view 1 forms....
        self.assertEqual(
            1,
            len(self.model.objects.get_objects(self.user2))
        )
        # user2 should only be able to edit 1 forms...
        self.assertEqual(
            1,
            len(self.model.objects.get_objects_editable(self.user2))
        )

    def test_public_can_view_objects(self):
        self.assertEqual(
            0,
            len(self.model.objects.get_objects_public())
        )

        # first, set all projects to public:
        oa = models.ObjectAuthority.objects.get(
            id=models.ObjectAuthority.PUBLIC)
        self.group1.access_authority = oa
        self.group1.save()
        self.group2.access_authority = oa
        self.group2.save()

        self.assertEqual(
            2,
            len(self.model.objects.get_objects_public())
        )


class BatchProjectQuerySecurityTest(test.TestCase, BatchQueryGroupMixin):
    model = models.Project

    def setUp(self):
        BatchQueryGroupMixin.setUp(self)
        
    
    def tearDown(self):
        BatchQueryGroupMixin.tearDown(self)
    


    def _create_groups(self):
        # delete all projects in database:
        models.Project.objects.all().delete()

        # and add two new ones:
        self.group1 = self.create_project(
            self.owner,
            name='Project #1',
            authority_id=1
        )
        self.group2 = self.create_project(
            self.owner,
            name='Project #2',
            authority_id=1
        )
        self.form = self.create_form_with_fields(
            user=self.owner,
            authority_id=1,
            project=self.group1
        )


class BatchFormQuerySecurityTest(test.TestCase, BatchQueryGroupMixin):
    model = models.Form

    def setUp(self):
        BatchQueryGroupMixin.setUp(self)
        
    def tearDown(self):
        BatchQueryGroupMixin.tearDown(self)

    def _create_groups(self):
        self.project1 = self.create_project(
            self.owner,
            name='Project #1',
            authority_id=1
        )
        self.project2 = self.create_project(
            self.owner,
            name='Project #2',
            authority_id=1
        )

        self.group1 = self.create_form_with_fields(
            user=self.owner,
            authority_id=1
        )
        self.group1.projects.add(self.project1)

        self.group2 = self.create_form_with_fields(
            user=self.owner,
            authority_id=1
        )
        self.group2.projects.add(self.project2)

    def test_project_viewer_can_view_objects(self):
        # grant user2 view privs to project1 (which corresponds
        # to group1):

        # self._debug()
        self.add_group_viewer(self.project1, self.user2)
        # self._debug()

        # user2 should be able to view 1 form....
        self.assertEqual(
            1,
            len(self.model.objects.get_objects(self.user2))
        )
        # user2 should only be able to edit 0 forms...
        self.assertEqual(
            0,
            len(self.model.objects.get_objects_editable(self.user2))
        )

    def test_project_editor_can_view_and_edit_objects(self, ):
        # grant user2 view privs to project1 (which corresponds
        # to group1):
        self.add_group_editor(self.project1, self.user2)
        self.assertEqual(
            1,
            len(self.model.objects.get_objects(self.user2))
        )
        self.assertEqual(
            1,
            len(self.model.objects.get_objects_editable(self.user2))
        )

    def test_project_manager_can_view_and_edit_objects(self, ):
        self.add_group_manager(self.project1, self.user2)
        self.assertEqual(
            1,
            len(self.model.objects.get_objects(self.user2))
        )
        self.assertEqual(
            1,
            len(self.model.objects.get_objects_editable(self.user2))
        )

    def test_project_public_can_view_objects(self):
        self.assertEqual(
            0,
            len(self.model.objects.get_objects_public())
        )

        # first, set all projects to public:
        oa = models.ObjectAuthority.objects.get(
            id=models.ObjectAuthority.PUBLIC)
        self.project1.access_authority = oa
        self.project1.save()
        self.project2.access_authority = oa
        self.project2.save()

        self.assertEqual(
            2,
            len(self.model.objects.get_objects_public())
        )


class BatchViewQuerySecurityTest(test.TestCase, BatchQueryGroupMixin):
    model = models.Snapshot

    def setUp(self):
        BatchQueryGroupMixin.setUp(self)
        
    def tearDown(self):
        BatchQueryGroupMixin.tearDown(self)

    def _create_groups(self):
        # delete all views in database:
        models.Snapshot.objects.all().delete()

        # and add two new ones:
        self.group1 = self.create_snapshot(
            self.owner,
            name='View #1',
            authority_id=1
        )
        self.group2 = self.create_snapshot(
            self.owner,
            name='View #2',
            authority_id=1
        )
