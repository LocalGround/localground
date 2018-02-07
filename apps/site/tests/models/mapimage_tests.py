from localground.apps.site.models import MapImage
from django.conf import settings
from django.contrib.gis.db import models
from localground.apps.site.tests.models import \
    BaseUploadedMediaAbstractModelClassTest
from django import test
import Image
from localground.apps.site.fields import LGImageField
from django.contrib.contenttypes import generic
from rest_framework import status
from django.core.files import File
import httplib
import urllib


class MapImageTest(BaseUploadedMediaAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseUploadedMediaAbstractModelClassTest.setUp(self)
        self.model = self.create_mapimage()
        self.object_type = 'map-image'
        self.model_name = 'map_image'
        self.pretty_name = 'map image'
        self.model_name_plural = 'map-images'
        self.pretty_name_plural = 'map images'

    def generate_map_image(self, **kwargs):
        user = self.user
        project = self.project
        # Attempting to make fake image
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
                'project': self.project,
                # generic does not have 'generateID'
                # according to test error despite that
                # generic has the function
                'uuid': generic.generateID(),
                'status': models.StatusCode.objects.get(
                    id=models.StatusCode.READY_FOR_PROCESSING),
            }
            map_image = models.MapImage.objects.create(**photo_data)
            map_image.process_file(File(data))
        return map_image

    # A streamlined approach to checking all the properties
    # from the class being tested on
    def test_model_properties(self):
        for prop in [
            ('uuid', models.CharField),
            ('source_print', models.ForeignKey),
            ('status', models.ForeignKey),
            ('file_name_thumb', models.CharField),
            ('file_name_scaled', models.CharField),
            ('scale_factor', models.FloatField),
            ('upload_source', models.ForeignKey),
            ('email_sender', models.CharField),
            ('email_subject', models.CharField),
            ('email_body', models.TextField),
            ('qr_rect', models.CharField),
            ('qr_code', models.CharField),
            ('map_rect', models.CharField),
            ('processed_image', models.ForeignKey)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = MapImage._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)

    def test_thumb(self):
        self.assertEqual(
            self.model.thumb(),
            settings.SERVER_URL + '/' + settings.USER_MEDIA_DIR +
            '/media/tester/map-images/' + self.model.file_name_thumb
        )

    def test_get_abs_directory_path(self):
        self.assertEqual(
            self.model.get_abs_directory_path(),
            settings.FILE_ROOT + '/' + settings.USER_MEDIA_DIR +
            '/media/tester/map-images/'
        )

    def test_original_image_filesystem(self):
        self.assertEqual(
            self.model.original_image_filesystem(),
            self.model.get_abs_directory_path() + self.model.file_name_new
        )

    def test_processed_map_filesystem(self):
        self.assertEqual(
            self.model.processed_map_filesystem(),
            self.model.get_abs_directory_path() +
            self.model.processed_image.file_name_orig
        )

    def test_processed_map_url_path(self):
        self.assertEqual(
            self.model.processed_map_url_path(),
            settings.SERVER_URL + '/' + settings.USER_MEDIA_DIR +
            '/media/tester/map-images/' +
            self.model.processed_image.file_name_orig
        )
    '''
    Create tests for the following:

    Successfully uploading the files to S3
    Successfully removing the files from S3
        (requires upload first before delete)

    '''

    def test_remove_map_images_from_S3(self, **kwargs):
        # The process_map_image needs parameters
        # Need fake validated_data to work
        map_image = self.generate_map_image(**kwargs)
        urls = [
            map_image.media_file_thumb,
            map_image.media_file_scaled
        ]

        # files should exist on S3:
        for url in urls:
            p = urlparse(url)
            conn = httplib.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 200)

        # now delete map images
        map_image.remove_map_image_from_S3()

        # files should not exist on S3:
        for url in urls:
            p = urlparse(url)
            conn = httplib.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 403)

    '''
    TODO: Next Sprint: write tests for Processor
    '''
