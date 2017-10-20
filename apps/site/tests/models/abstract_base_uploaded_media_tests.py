from localground.apps.site import models
from localground.apps.site.tests.models.abstract_base_audit_tests import \
    BaseAuditAbstractModelClassTest
from localground.apps.site.tests.models.mixin_project_tests import \
    ProjectMixinTest


class BaseUploadedMediaAbstractModelClassTest(
        # TODO: MediaMixin,
        # TODO: NamedMixin
        ProjectMixinTest,
        BaseAuditAbstractModelClassTest):

    def setUp(self):
        BaseAuditAbstractModelClassTest.setUp(self)
