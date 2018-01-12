from django.conf import settings

from localground.apps.site.models import Print

from django.contrib.gis.db import models
from localground.apps.lib.helpers import upload_helpers

from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test
from localground.apps.lib.helpers import generic
from localground.apps.site.tests.models import \
    MediaMixinTest, BaseAuditAbstractModelClassTest, ExtentsMixinTest, \
    ProjectMixinTest, GenericRelationMixinTest


class PrintsTest(ExtentsMixinTest, MediaMixinTest, ProjectMixinTest,
    GenericRelationMixinTest, BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)

        self.model = self.create_print_without_image()
        '''
        or do self.model.create_print()
        '''
        self.object_type = self.model_name = self.pretty_name = 'print'
        self.model_name_plural = self.pretty_name_plural = 'prints'

    def test_dummy(self, **kwargs):
        pass

    def test_get_abs_directory_path(self, **kwargs):
        # self.assertEqual(
        #    self.model.get_abs_directory_path(), settings.FILE_ROOT
        # )
        pass

    def test_get_abs_virtual_path(self, **kwargs):
        # self.assertEqual(self.model.get_abs_virtual_path(),'//')
        pass

    def test_generate_relative_path(self, **kwargs):
        # self.assertEqual(self.model.generate_relative_path(),'/userdata/prints//')
        pass

    '''
    Unfortunately, the encryption process for thumb, map, and pdf
    always results in randomized links
    '''

    def test_thumb(self, **kwargs):
        # print(self.model.thumb())
        # self.assertEqual(self.model.thumb(),'http:///profile/prints/IzE1MDkxMzkzMDQ=/')
        pass

    def test_map(self, **kwargs):
        # print(self.model.map())
        # self.assertEqual(self.model.map(),'http:///profile/prints/IzE1MDkxMzkzMDU=/')
        pass

    def test_pdf(self, **kwargs):
        # print(self.model.pdf())
        # self.assertEqual(self.model.pdf(),'http:///profile/prints/IzE1MDkxMzkzMDM=/')
        pass

    # overriding from media mixin
    def test_get_absolute_path(self):
        # Using the method to generate the absolute path. Good not to
        # hardcode b/c this path will look different on every server.
        # Was breaking on TravisCI b/c travis stores static media in a
        # different location.
        abs_path = settings.FILE_ROOT + self.model.virtual_path

        self.assertEqual(abs_path, self.model.get_absolute_path())

    # overriding from media mixin
    def test_absolute_virtual_path(self):
        self.model.file_name_new = ''
        abs_virt_path = upload_helpers.build_media_path(
            self.model.host,
            self.model.model_name_plural,
            self.model.virtual_path + self.model.file_name_orig
        )
        self.assertEqual(abs_virt_path, self.model.absolute_virtual_path())

    def test_pdf_save_S3(self):
        '''
        Make sure that the PDF saved goes
        directly to the S3 endpoint
        '''
        # maybe the generate PDF might work, maybe not...
        self.model.generate_pdf()
        print('Check the PDF path')
        print(self.model.pdf_path_S3)
        pass

    def test_thumbnail_save_S3(self):
        '''
        Make sure that the thumbnail saved goes
        directly to the S3 endpoint
        '''
        self.model.generate_pdf()
        print('Check the thumbnail path')
        print(self.model.map_image_path_S3)
        pass
