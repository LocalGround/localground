from django import test
import Image
from django.contrib.gis.db.models import CharField
from localground.apps.site.fields import LGImageField
from localground.apps.site import models
from localground.apps.site.tests.models.abstract_base_audit_tests import \
    BaseAuditAbstractModelClassTest
from localground.apps.site.tests.models.mixin_project_tests import \
    ProjectMixinTest
from localground.apps.site.tests.models.mixin_point_tests import PointMixinTest
from localground.apps.site.tests.models import ExtrasMixinTest
import os
import tempfile
from django.conf import settings
from rest_framework import status
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from django.core.files import File
import http.client
import urllib
from urlparse import urlparse
# by adding the json name, the error is different:
# going from json not defined to attributeError: read when opening an image
import json


class PhotoModelTest(ExtrasMixinTest, PointMixinTest, ProjectMixinTest,
                     BaseAuditAbstractModelClassTest, test.TestCase):

    # To run test:
    # $ python manage.py test localground.apps.site.tests.models.PhotoModelTest
    def setUp(self):
        BaseAuditAbstractModelClassTest.setUp(self)
        PointMixinTest.setUp(self)
        ExtrasMixinTest.setUp(self)
        self.model = self.create_photo()
        self.object_type = self.model_name = self.pretty_name = 'photo'
        self.model_name_plural = self.pretty_name_plural = 'photos'

    def tearDown(self):
        # delete method also removes files from file system:
        for photo in models.Photo.objects.all():
            photo.delete()

    def generate_photo(self, **kwargs):

        user = self.user
        project = self.project
        image = Image.new('RGB', (200, 100))
        tmp_file = 'test.jpg'
        image.save(tmp_file)
        author_string = 'Author of the media file'
        tags = "j,k,l"

        with open(tmp_file, 'rb') as data:
            photo_data = {
                'attribution': user.username,
                'host': settings.SERVER_HOST,
                'owner': user,
                'last_updated_by': user,
                'time_stamp': get_timestamp_no_milliseconds(),
                'project': self.project
            }
            photo = models.Photo.objects.create(**photo_data)
            media_path = photo.get_absolute_path()
            photo.process_file(File(data))
        return photo

    def test_photo_rotates_right(self, **kwargs):
        photo = self.generate_photo(**kwargs)
        self._test_photo_rotates(photo, photo.rotate_right, **kwargs)

    def test_photo_rotates_left(self, **kwargs):
        photo = self.generate_photo(**kwargs)
        self._test_photo_rotates(photo, photo.rotate_left, **kwargs)

    def _test_photo_rotates(self, photo, rotate_function, **kwargs):
        # save all URLs to old images:
        stale_urls = [
            photo.media_file_orig.url,
            photo.media_file_large.url,
            photo.media_file_medium.url,
            photo.media_file_medium_sm.url,
            photo.media_file_small.url,
            photo.media_file_marker_lg.url,
            photo.media_file_marker_sm.url
        ]

        # check that the dimensions are as they should be:
        self.assertEqual(photo.media_file_orig.width, 200)
        self.assertEqual(photo.media_file_orig.height, 100)

        # rotate photo to the right:
        rotate_function()

        # check that photo has rotated 90 degrees
        self.assertEqual(photo.media_file_orig.width, 100)
        self.assertEqual(photo.media_file_orig.height, 200)

        # test that stale images have been removed from Amazon:
        for url in stale_urls:
            p = urlparse(url)
            conn = http.client.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 403)

    def test_model_properties(self, **kwargs):
        from localground.apps.site.models import BaseUploadedMedia
        for prop in [
            ('media_file_orig', LGImageField),
            ('media_file_large', LGImageField),
            ('media_file_medium', LGImageField),
            ('media_file_medium_sm', LGImageField),
            ('media_file_small', LGImageField),
            ('media_file_marker_lg', LGImageField),
            ('media_file_marker_sm', LGImageField),
            ('device', CharField)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = models.Photo._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)

        self.assertTrue(hasattr(self.model, 'filter_fields'))

    def test_remove_media_from_s3(self, **kwargs):
        photo = self.generate_photo(**kwargs)
        urls = [
            photo.media_file_orig.url,
            photo.media_file_large.url,
            photo.media_file_medium.url,
            photo.media_file_medium_sm.url,
            photo.media_file_small.url,
            photo.media_file_marker_lg.url,
            photo.media_file_marker_sm.url
        ]
        # files should exist on S3:
        for url in urls:
            p = urlparse(url)
            conn = http.client.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 200)

        # now delete photo:
        photo.delete()

        # files should not exist on S3:
        for url in urls:
            p = urlparse(url)
            conn = http.client.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 403)

    def test_unicode_(self):
        test_string = '%s (%s)' % (
            self.model.name, self.model.file_name_orig
        )
        self.assertEqual(self.model.__unicode__(), test_string)

    def test_read_exif_data(self):
        from PIL.ExifTags import TAGS

        d = {

            'DateTimeOriginal': '',
            'DateTimeDigitized': '',
            'DateTime': '',
            'Model': '',
            'Orientation': '',
            'Model': '7777',
            'GPSInfo': {
                0: '\x00\x00\x02\x02',
                1: u'S',
                2: ((33, 1), (51, 1), (2191, 100)),
                3: u'E',
                4: ((151, 1), (13, 1), (1173, 100)),
                5: '\x00',
                6: (0, 1)}
            }
        image = Image.new('RGB', (200, 100))
        # exif_data = image.info['exif']
        tmp_file = 'test.jpg'
        image.save(tmp_file, "JPEG", quality=85, exif=json.dumps(d))
        im = Image.open(tmp_file)
        # There has to be a better way to check for exif data
        self.assertTrue(tmp_file is not None)
