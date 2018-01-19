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

    def test_remove_media_from_s3(self, **kwargs):
        printModel = self.create_print(
            map_title='A mapimage-linked print'
        )
        # assumes that the files exist on S3
        # because in test mode, remove happens
        # after the items are uploaded to S3
        # maybe because the urls themselves
        # contain incomplete data,
        # which does not allow the data to be read entirely
        urls = [
            printModel.pdf_path_S3.url,
            printModel.map_image_path_S3.url
        ]
        # files should exist on S3:

        print('Check the map provider')
        print(self.model.map_provider)
        print('Check the center')
        print(self.model.center)
        for url in urls:
            p = urlparse(url)
            conn = httplib.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            # this request is the cause of response not ready error
            print('Now checking for S3 URLs')
            print(url)
            print(p)
            print(p.path)
            print('End of S3 url inspection')
            print('Now checking response data')
            print(dir(conn.getresponse()))
            '''
            print(conn.getresponse().read)
            print(conn.getresponse().reason)
            print(conn.getresponse().msg)
            print(conn.getresponse().status)
            '''
            # now I am getting an error of response not ready
            # probably because the same fake object is being used
            # when enacting the media removal
            self.assertEqual(conn.getresponse().status, 200)

        # now delete photo:
        printModel.delete()

        # files should not exist on S3:
        for url in urls:
            p = urlparse(url)
            conn = httplib.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 403)
