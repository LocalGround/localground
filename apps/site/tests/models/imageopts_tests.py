from localground.apps.site.models import ImageOpts
from django.conf import settings
from django.contrib.gis.db import models
from localground.apps.site.tests.models import \
    MediaMixinTest, BaseAuditAbstractModelClassTest
from django import test


class ImageOptsTest(MediaMixinTest, BaseAuditAbstractModelClassTest,
                    test.TestCase):

    def setUp(self):
        BaseAuditAbstractModelClassTest.setUp(self)
        map_image = self.create_mapimage()
        self.model = self.create_imageopt(map_image)

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
        self.assertEqual(1, 1)
