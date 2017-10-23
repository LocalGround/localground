from localground.apps.site import models
from localground.apps.site.tests.models.abstract_base_audit_tests import \
    BaseAuditAbstractModelClassTest
from localground.apps.site.tests.models.mixin_project_tests import \
    ProjectMixinTest
from localground.apps.site.tests.models import MediaMixinTest, NamedMixinTest


class BaseUploadedMediaAbstractModelClassTest(
        MediaMixinTest,
        NamedMixinTest,
        ProjectMixinTest,
        BaseAuditAbstractModelClassTest):

    def setUp(self):
        BaseAuditAbstractModelClassTest.setUp(self)
