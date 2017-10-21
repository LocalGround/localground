from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models
from localground.apps.lib.helpers import upload_helpers


class MediaMixinTest(ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_media_mixin_creates_attributes(self):
        self.assertTrue(hasattr(self.model, 'host'))
        self.assertTrue(hasattr(self.model, 'virtual_path'))
        self.assertTrue(hasattr(self.model, 'file_name_orig'))
        self.assertTrue(hasattr(self.model, 'content_type'))
        self.assertTrue(hasattr(self.model, 'groups'))
        self.assertTrue(hasattr(self.model, 'filter_fields'))

    def test_get_absolute_path(self):
        # Using the method to generate the absolute path
        abs_path = upload_helpers.generate_absolute_path(
            self.user, self.model.model_name_plural
        )
        # abs_path = '/localground/userdata/media/tester/audio/'
        self.assertEqual(abs_path, self.model.get_absolute_path())
