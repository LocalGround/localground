from localground.apps.site.models import MapImage

from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test

class MapImageTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = MapImage()

    # A streamlined approach to checking all the properties
    # from the class being tested on
    def test_model_properties(self, **kwargs):
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
