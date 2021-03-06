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

import httplib
import urllib
from urlparse import urlparse


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

    def test_remove_media_from_s3(self, **kwargs):
        printModel = self.create_print(
            map_title='A mapimage-linked print'
        )

        '''
        The files have been uploaded successfully
        under the name 'tester' in the prints folder.
        The files are present, however they are not properly read
        '''
        urls = [
            printModel.pdf_path_S3.url,
            printModel.map_image_path_S3.url
        ]
        # Successfully adds PDF and Image to S3
        for url in urls:
            p = urlparse(url)
            conn = httplib.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 200)

        # now delete photo:
        printModel.delete()

        # files should not exist on S3:
        for url in urls:
            p = urlparse(url)
            conn = httplib.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 403)
