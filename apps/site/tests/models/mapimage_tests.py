from localground.apps.site.models import MapImage
from django.conf import settings
from django.contrib.gis.db import models
from localground.apps.site.tests.models import \
    BaseUploadedMediaAbstractModelClassTest
from django import test


class MapImageTest(BaseUploadedMediaAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseUploadedMediaAbstractModelClassTest.setUp(self)
        self.model = self.create_mapimage()
        self.object_type = 'map-image'
        self.model_name = 'map_image'
        self.pretty_name = 'map image'
        self.model_name_plural = 'map-images'
        self.pretty_name_plural = 'map images'

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
        import base64
        from localground.apps.lib.helpers import upload_helpers
        thumb_decoded = base64.b64decode(self.model.thumb().split('/')[-2])
        thumb_decoded = thumb_decoded.split('#')[0]
        self.assertEqual(
            thumb_decoded,
            '/' + settings.USER_MEDIA_DIR + '/media/tester/map-images/' +
            self.model.file_name_thumb
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
        import base64
        from localground.apps.lib.helpers import upload_helpers
        file_name_orig = base64.b64decode(
            self.model.processed_map_url_path().split('/')[-2]
        )
        file_name_orig = file_name_orig.split('#')[0]
        self.assertEqual(
            file_name_orig,
            '/' + settings.USER_MEDIA_DIR + '/media/tester/map-images/' +
            self.model.processed_image.file_name_orig
        )

    '''
    TODO: Next Sprint: write tests for Processor
    '''
