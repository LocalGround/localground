from localground.apps.site import models
from localground.apps.site.tests.models.abstract_base_audit_tests import \
    BaseAuditAbstractModelClassTest
from localground.apps.site.tests.models.mixin_project_tests import \
    ProjectMixinTest
from localground.apps.site.tests.models.mixin_point_tests import PointMixinTest


class AudioModelTest(PointMixinTest, ProjectMixinTest,
                     BaseAuditAbstractModelClassTest):

    def setUp(self):
        BaseAuditAbstractModelClassTest.setUp(self)

    def tearDown(self):
        # delete method also removes files from file system:
        for audio in models.Audio.objects.all():
            audio.delete()

    def test_dummy_audio(self, **kwargs):
        self.assertEqual(1, 1)
