from localground.apps.site.models import StatusCode
from localground.apps.site.models import UploadSource
from localground.apps.site.models import UploadType
from localground.apps.site.models import ErrorCode
from localground.apps.site.models import ObjectTypes
from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test


class StatusCodeTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = StatusCode.get_status(1)
        self.object_type = 'status-code'
        self.model_name = 'status_code'
        self.pretty_name = 'status code'
        self.model_name_plural = 'status-codes'
        self.pretty_name_plural = 'status codes'

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
        self.assertEqual(str(self.model), '1. Ready for processing')

    def test_get_status(self, **kwargs):
        self.assertEqual(StatusCode.get_status(3).id, 3)
        self.assertEqual(StatusCode.get_status(3).name, 'Processed manually')


class UploadSourceTest(BaseAbstractModelClassTest, test.TestCase):
    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = UploadSource.get_source(1)
        self.object_type = 'upload-source'
        self.model_name = 'upload_source'
        self.pretty_name = 'upload source'
        self.model_name_plural = 'upload-sources'
        self.pretty_name_plural = 'upload sources'

    def test_static_lookup_properties(self, **kwargs):
        self.assertEqual(UploadSource.WEB_FORM, 1)
        self.assertEqual(UploadSource.EMAIL, 2)
        self.assertEqual(UploadSource.MANUAL, 3)

    def test_name(self, **kwargs):
        self.assertTrue(hasattr(self.model, 'name'))
        name = UploadSource._meta.get_field("name")
        self.assertTrue(isinstance(name, models.CharField))

    def test_unicode(self, **kwargs):
        # str method calls the __unicode__  private method
        self.assertEqual(str(self.model), '1. Web Dataset')

    def test_get_source(self, **kwargs):
        self.assertEqual(UploadSource.get_source(2).id, 2)
        self.assertEqual(UploadSource.get_source(2).name, 'Email')


class UploadTypeTest(BaseAbstractModelClassTest, test.TestCase):
    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = UploadType.objects.get(id=1)
        self.object_type = 'upload-type'
        self.model_name = 'upload_type'
        self.pretty_name = 'upload type'
        self.model_name_plural = 'upload-types'
        self.pretty_name_plural = 'upload types'

    def test_name(self, **kwargs):
        self.assertTrue(hasattr(self.model, 'name'))
        name = UploadType._meta.get_field("name")
        self.assertTrue(isinstance(name, models.CharField))

    def test_unicode(self, **kwargs):
        # str method calls the __unicode__  private method
        self.assertEqual(str(self.model), '1. map')


class ErrorCodeTest(BaseAbstractModelClassTest, test.TestCase):
    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = ErrorCode.objects.get(id=1)
        self.object_type = 'error-code'
        self.model_name = 'error_code'
        self.pretty_name = 'error code'
        self.model_name_plural = 'error-codes'
        self.pretty_name_plural = 'error codes'
        

    def test_name_and_description(self, **kwargs):
        self.assertTrue(hasattr(self.model, 'name'))
        self.assertTrue(hasattr(self.model, 'description'))
        name = ErrorCode._meta.get_field("name")
        description = ErrorCode._meta.get_field("description")
        self.assertTrue(isinstance(name, models.CharField))
        self.assertTrue(isinstance(description, models.CharField))

    def test_unicode(self, **kwargs):
        # str method calls the __unicode__  private method
        self.assertEqual(
            str(self.model),
            '1. Map rectangle could not be found'
        )


class ObjectTypeTest(test.TestCase):

    def test_object_types(self, **kwargs):
        self.assertEqual(ObjectTypes.PHOTO, 'photo')
        self.assertEqual(ObjectTypes.AUDIO, 'audio')
        self.assertEqual(ObjectTypes.VIDEO, 'video')
        self.assertEqual(ObjectTypes.MARKER, 'marker')
        self.assertEqual(ObjectTypes.SCAN, 'mapimage')
        self.assertEqual(ObjectTypes.PRINT, 'print')
        self.assertEqual(ObjectTypes.RECORD, 'record')
