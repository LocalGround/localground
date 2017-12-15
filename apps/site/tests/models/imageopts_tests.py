from localground.apps.site.models import ImageOpts
from django.conf import settings
from django.contrib.gis.db import models
from localground.apps.site.tests.models import \
    MediaMixinTest, BaseAuditAbstractModelClassTest,ExtentsMixinTest, ModelMixin
from django import test


class ImageOptsTest(ExtentsMixinTest, MediaMixinTest,
    ModelMixin, test.TestCase):

    def setUp(self):
        ModelMixin.setUp(self)
        map_image = self.create_mapimage()
        self.model = self.create_imageopt(map_image)

    def test_absolute_virtual_path(self):
        # overrides MediaMixinTest
        self.assertEqual(1, 1)

    def test_model_properties(self):
        for prop in [
            ('source_mapimage', models.ForeignKey),
            ('opacity', models.FloatField),
            ('name', models.CharField)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = ImageOpts._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)

    def test_model_name(self):
        self.assertEqual(
            self.model.source_mapimage.model_name,
            'map_image'
        )

    def test_model_name_plural(self):
        self.assertEqual(
            self.model.source_mapimage.model_name_plural,
            'map-images'
        )

    def test_processed_map_url_path(self):
        self.assertEqual(
            self.model.processed_map_url_path(),
            settings.SERVER_URL + '/' + settings.USER_MEDIA_DIR +
            '/media/tester/map-images/' +
            self.model.file_name_orig
        )
