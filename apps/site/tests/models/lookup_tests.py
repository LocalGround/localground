from localground.apps.site.models import StatusCode
from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test


class StatusCodeTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = StatusCode.get_status(1)

    def test_static_lookup_properties(self, **kwargs):
        self.assertEqual(StatusCode.READY_FOR_PROCESSING, 1)
        self.assertEqual(StatusCode.PROCESSED_SUCCESSFULLY, 2)
        self.assertEqual(StatusCode.PROCESSED_MANUALLY, 3)
        self.assertEqual(StatusCode.ERROR_UNKNOWN, 4)
        self.assertEqual(StatusCode.DIRECTORY_MISSING, 5)
        self.assertEqual(StatusCode.PRINT_NOT_FOUND, 6)
        self.assertEqual(StatusCode.QR_CODE_NOT_READ, 7)
        self.assertEqual(StatusCode.QR_RECT_NOT_FOUND, 8)
        self.assertEqual(StatusCode.MAP_RECT_NOT_FOUND, 9)
        self.assertEqual(StatusCode.FILE_WRITE_PRIVS, 10)

    def test_model_properties(self, **kwargs):
        self.assertTrue(hasattr(self.model, 'name'))
        self.assertTrue(hasattr(self.model, 'description'))
        name = StatusCode._meta.get_field("name")
        description = StatusCode._meta.get_field("description")
        self.assertTrue(isinstance(name, models.CharField))
        self.assertTrue(isinstance(description, models.CharField))

    def test_unicode(self, **kwargs):
        # str method calls the __unicode__  private method
        self.assertEqual(str(self.model), '1: Ready for processing')

    def test_get_status(self, **kwargs):
        self.assertEqual(StatusCode.get_status(3).id, 3)
        self.assertEqual(StatusCode.get_status(3).name, 'Processed manually')
