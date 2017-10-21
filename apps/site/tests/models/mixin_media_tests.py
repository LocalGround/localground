from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models


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
        abs_path = '/localground/userdata/media/tester/audio/'
        self.assertEqual(abs_path, self.model.get_absolute_path())