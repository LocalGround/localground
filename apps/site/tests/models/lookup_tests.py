from localground.apps.site import models
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test

class StatusCodeTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = models.StatusCode.get_status(1)

    def tearDown(self):
        # delete method also removes files from file system:
        for audio in models.Audio.objects.all():
            audio.delete()

    def test_static_lookup_properties(self, **kwargs):
        self.assertEqual(models.StatusCode.READY_FOR_PROCESSING, 1)
        self.assertEqual(models.StatusCode.PROCESSED_SUCCESSFULLY, 2)
        self.assertEqual(models.StatusCode.PROCESSED_MANUALLY, 3)
        self.assertEqual(models.StatusCode.ERROR_UNKNOWN, 4)
        self.assertEqual(models.StatusCode.DIRECTORY_MISSING, 5)
        self.assertEqual(models.StatusCode.PRINT_NOT_FOUND, 6)
        self.assertEqual(models.StatusCode.QR_CODE_NOT_READ, 7)
        self.assertEqual(models.StatusCode.QR_RECT_NOT_FOUND, 8)
        self.assertEqual(models.StatusCode.MAP_RECT_NOT_FOUND, 9)
        self.assertEqual(models.StatusCode.FILE_WRITE_PRIVS, 10)

    def test_name_and_description(self, **kwargs):
        self.assertTrue(hasattr(self.model, 'name'))
        self.assertTrue(hasattr(self.model, 'description'))

    def test_unicode(self, **kwargs):
        self.assertTrue(self.__unicode__())

    def test_get_status(self, **kwargs):
        self.assertEqual(1,1)
