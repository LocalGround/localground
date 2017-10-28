from localground.apps.site.models import MapImage
from django.conf import settings
from django.contrib.gis.db import models
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test

class MapImageTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = self.create_mapimage()

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
            self.assertEqual(
                field.name,
                prop_name
            )
            self.assertEqual(
                type(field),
                prop_type
            )

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
