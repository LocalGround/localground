from django import test
from django.core import management
from django.contrib.auth.models import AnonymousUser
from localground.apps.site import models
from localground.apps.site.managers.base import GenericLocalGroundError
from localground.apps.site.tests import ModelMixin
from rest_framework import status
import urllib


class BatchQueryObjectMixin(ModelMixin):
    model = models.BaseMedia
    create_function_name = None
    file_names = ['a', 'b', 'c']

    def setUp(self):
        #for this test, don't use the default fixtures
        ModelMixin.setUp(self, load_fixtures=False)

        # create 3 users:
        self.users = [self.create_user(username=u)
                      for u in ['u1', 'u2', 'u3']]
        # create 3 projects (1 per user):
        self.projects = []
        for i, user in enumerate(self.users):
            self.projects.append(
                self.create_project(
                    self.users[i],
                    name='Project #%s' % (i + 1),
                    authority_id=1
                )
            )

        # create 3 objects per project:
        self._create_objects()
        
    def tearDown(self):
        models.Form.objects.all().delete()
        
    def _create_objects(self):
        create_object_function = getattr(self, self.create_function_name)
        self.objects = []

        for project in self.projects:
            for i, fn in enumerate(self.file_names):
                self.objects.append(
                    create_object_function(
                        project.owner, project,
                        name='%s #%s' % (self.model.pretty_name, i + 1),
                        file_name=fn
                    )
                )

    def test_owner_can_view_objects(self):
        self.assertEqual(
            3,
            len(self.model.objects.get_objects(self.users[0]))
        )

    def test_owner_can_edit_objects(self):
        self.assertEqual(
            3,
            len(self.model.objects.get_objects_editable(self.users[0]))
        )

    def test_anonymous_cannot_view_objects(self):
        allows_query = True
        try:
            self.model.objects.get_objects(AnonymousUser())
        except GenericLocalGroundError:
            allows_query = False
        self.assertFalse(allows_query)

    def test_viewer_can_view_objects(self, ):
        # grant user(1) view privs to project(0):
        self.add_group_viewer(self.projects[0], self.users[1])

        # user(1) should be able to view 6 projects....
        self.assertEqual(
            6,
            len(self.model.objects.get_objects(self.users[1]))
        )
        # user(1) should only be able to edit 3 projects...
        self.assertEqual(
            3,
            len(self.model.objects.get_objects_editable(self.users[1]))
        )

    def test_anonymous_cannot_edit_objects(self):
        allows_query = True
        try:
            self.model.objects.get_objects_editable(AnonymousUser())
        except GenericLocalGroundError:
            allows_query = False
        self.assertFalse(allows_query)

    def test_editor_can_view_and_edit_objects(self, ):
        self.add_group_editor(self.projects[0], self.users[1])
        self.assertEqual(
            6,
            len(self.model.objects.get_objects(self.users[1]))
        )
        self.assertEqual(
            6,
            len(self.model.objects.get_objects_editable(self.users[1]))
        )

    def test_manager_can_view_and_edit_objects(self, ):
        self.add_group_manager(self.projects[0], self.users[1])
        self.assertEqual(
            6,
            len(self.model.objects.get_objects(self.users[1]))
        )
        self.assertEqual(
            6,
            len(self.model.objects.get_objects_editable(self.users[1]))
        )

    def test_public_can_view_objects(self):
        self.assertEqual(
            0,
            len(self.model.objects.get_objects_public())
        )

        # first, set all projects to public:
        oa = models.ObjectAuthority.objects.get(
            id=models.ObjectAuthority.PUBLIC)
        for project in self.projects:
            project.access_authority = oa
            project.save()

        self.assertEqual(
            9,
            len(self.model.objects.get_objects_public())
        )


class BatchPhotoQuerySecurityTest(test.TestCase, BatchQueryObjectMixin):
    model = models.Photo
    create_function_name = 'create_photo'
    file_names = ['photo_1.jpg', 'photo_2.jpg', 'photo_3.jpg']

    def setUp(self):
        BatchQueryObjectMixin.setUp(self)


class BatchAudioQuerySecurityTest(test.TestCase, BatchQueryObjectMixin):
    model = models.Audio
    create_function_name = 'create_audio'
    file_names = ['audio_1.mp3', 'audio_2.mp3', 'audio_3.mp3']

    def setUp(self):
        BatchQueryObjectMixin.setUp(self)


class BatchMarkerQuerySecurityTest(test.TestCase, BatchQueryObjectMixin):
    model = models.Marker

    def setUp(self):
        BatchQueryObjectMixin.setUp(self)

    def _create_objects(self):
        self.objects = []
        for project in self.projects:
            for i, fn in enumerate(self.file_names):
                self.objects.append(
                    self.create_marker(
                        project.owner, project)
                )


class BatchRecordQuerySecurityTest(test.TestCase, BatchQueryObjectMixin):
    model = None

    def setUp(self):
        BatchQueryObjectMixin.setUp(self)

    def _create_objects(self):
        num_fields = 3
        form = self.create_form_with_fields(num_fields=num_fields)
        self.model = form.TableModel
        self.objects = []
        for project in self.projects:
            for i, fn in enumerate(self.file_names):
                self.objects.append(
                    self.insert_form_data_record(form, project)
                )

    def test_viewer_can_view_objects_detailed(self, ):
        # grant user(1) view privs to project(0):
        self.add_group_viewer(self.projects[0], self.users[1])

        # user(1) should be able to view 6 projects....
        self.assertEqual(
            6,
            len(self.model.objects.get_objects_detailed(self.users[1]))
        )
        # user(1) should only be able to edit 3 projects...
        self.assertEqual(
            3,
            len(self.model.objects.get_objects_editable(self.users[1]))
        )
