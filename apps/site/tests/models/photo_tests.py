from django import test
import Image
from localground.apps.site import models
from localground.apps.site.models import Photo
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
from localground.apps.site import models
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from django.core.files import File
import json


import urllib


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
            photo.remove_media_from_file_system()

    def test_photo_file_thumbnail_generator_works(self, **kwargs):
        """
        Step 1: move process_file() from photo serializer to photo model
        Step 2: instead of 'with open' post to api,
            do 'with open' and directly call model.process_file()
            (don't go through the api)
        Step 3: refactor more to make photo model DRY. Dont repeat code in rotate()
        """

        user = self.user
        project = self.project
        image = Image.new('RGB', (200, 100))
        tmp_file = 'test.jpg'
        image.save(tmp_file)
        author_string = 'Author of the media file'
        tags = "j,k,l"

        with open(tmp_file, 'rb') as data:

            '''
            response = self.client_user.post(
                '/api/0/photos/',
                {
                    'project_id': project.id,
                    'media_file': data,
                    'attribution': author_string,
                    'tags': tags
                },
                HTTP_X_CSRFTOKEN=self.csrf_token
            )
            '''
            photo_data = {
                'attribution': user.username,
                'host': settings.SERVER_HOST,
                'owner': user,
                'last_updated_by': user,
                'time_stamp': get_timestamp_no_milliseconds(),
                'project': self.project
            }
            attributes_from_processed_file = models.Photo.process_file(
                File(data), user
            )
            photo_data.update(attributes_from_processed_file)
            #photo = models.Photo.objects.get(id=response.get("id"))
            #result.update(self.get_presave_create_dictionary())

            photo = models.Photo.objects.create(**photo_data)
            media_path = photo.get_absolute_path()

            for file_name in [
                photo.file_name_large,
                photo.file_name_medium,
                photo.file_name_medium_sm,
                photo.file_name_small,
                photo.file_name_marker_lg,
                photo.file_name_marker_sm
            ]:
                self.assertTrue(len(file_name) > 4)
                self.assertTrue(os.path.exists(
                    '%s%s' % (media_path, file_name)))

            return photo

    def test_photo_rotates_right(self, **kwargs):
        photo = self.test_photo_file_thumbnail_generator_works(**kwargs)
        self._test_photo_rotates(photo, photo.rotate_right, **kwargs)

    def test_photo_rotates_left(self, **kwargs):
        photo = self.test_photo_file_thumbnail_generator_works(**kwargs)
        self._test_photo_rotates(photo, photo.rotate_left, **kwargs)

    def _test_photo_rotates(self, photo, rotate_function, **kwargs):
        import Image
        img_path = '%s%s' % (photo.get_absolute_path(), photo.file_name_orig)
        img = Image.open(img_path)
        (width, height) = img.size

        # check that the dimensions are as they should be:
        self.assertEqual(width, 200)
        self.assertEqual(height, 100)

        # rotate photo to the right:
        rotate_function(self.user)
        img_path = '%s%s' % (photo.get_absolute_path(), photo.file_name_orig)
        img = Image.open(img_path)
        (width, height) = img.size

        # check that photo has rotated 90 degrees
        self.assertEqual(width, 100)
        self.assertEqual(height, 200)

    def test_rotate_stale_images_removed_new_images_generated(self, **kwargs):
        import os
        photo = self.test_photo_file_thumbnail_generator_works(**kwargs)
        media_path = photo.get_absolute_path()

        # 1) save reference to paths and make sure they exist:
        stale_paths = [
            '%s%s' % (media_path, photo.file_name_large),
            '%s%s' % (media_path, photo.file_name_medium),
            '%s%s' % (media_path, photo.file_name_medium_sm),
            '%s%s' % (media_path, photo.file_name_small),
            '%s%s' % (media_path, photo.file_name_marker_lg),
            '%s%s' % (media_path, photo.file_name_marker_sm)
        ]
        for path in stale_paths:
            self.assertTrue(os.path.exists(path))

        # 2) rotate image:
        self._test_photo_rotates(photo, photo.rotate_right, **kwargs)

        # 3) ensure stale paths have been removed:
        for path in stale_paths:
            self.assertFalse(os.path.exists(path))

        # 4) ensure new paths have been created:
        new_paths = [
            '%s%s' % (media_path, photo.file_name_large),
            '%s%s' % (media_path, photo.file_name_medium),
            '%s%s' % (media_path, photo.file_name_medium_sm),
            '%s%s' % (media_path, photo.file_name_small),
            '%s%s' % (media_path, photo.file_name_marker_lg),
            '%s%s' % (media_path, photo.file_name_marker_sm)
        ]
        for path in new_paths:
            self.assertTrue(os.path.exists(path))


    def test_model_properties(self, **kwargs):
        from django.contrib.gis.db import models
        from localground.apps.site.models import BaseUploadedMedia
        for prop in [
            ('file_name_large', models.CharField),
            ('file_name_medium', models.CharField),
            ('file_name_medium_sm', models.CharField),
            ('file_name_small', models.CharField),
            ('file_name_marker_lg', models.CharField),
            ('file_name_marker_sm', models.CharField),
            ('device', models.CharField)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = Photo._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)

        self.assertTrue(hasattr(self.model, 'filter_fields'))

    def test_thumb(self, **kwargs):
        thumb_url = self.model.encrypt_url(self.model.file_name_small)
        self.assertEqual(self.model.thumb(), thumb_url)

    def test_absolute_virtual_path_medium_sm(self):
        path_md_sm = self.model.encrypt_url(self.model.file_name_medium_sm)
        self.assertEqual(
            self.model.absolute_virtual_path_medium_sm(),
            path_md_sm
        )

    def test_absolute_virtual_path_medium(self):
        path_medium = self.model.encrypt_url(self.model.file_name_medium)
        self.assertEqual(
            self.model.absolute_virtual_path_medium(),
            path_medium
        )

    def test_absolute_virtual_path_large(self):
        path_large = self.model.encrypt_url(self.model.file_name_large)
        self.assertEqual(
            self.model.absolute_virtual_path_large(),
            path_large
        )

    def test_remove_media_from_file_system(self):
        import os
        path = self.model.get_absolute_path();
        file_paths = [
            self.model.file_name_orig,
            self.model.file_name_new,
            self.model.file_name_large,
            self.model.file_name_medium,
            self.model.file_name_medium_sm,
            self.model.file_name_small,
            self.model.file_name_marker_lg,
            self.model.file_name_marker_sm
        ]


        photo = self.test_photo_file_thumbnail_generator_works()

        photo.remove_media_from_file_system()
        self.assertFalse(os.path.exists(
            '%s%s' % (path, photo.file_name_large)
            )
        )

    def test_unicode_(self):
        test_string = '%s (%s)' % (
            self.model.name, self.model.file_name_orig
        )
        self.assertEqual(self.model.__unicode__(), test_string)

    '''
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
        #exif_data = image.info['exif']
        tmp_file = 'test.jpg'
        image.save(tmp_file, "JPEG", quality=85, exif=json.dumps(d))
        im = Image.open(image)
        print(im._getexif())

    '''
