import os
from localground.apps.site.tests import ModelMixin
from django import test
from django.contrib.gis.db import models
from localground.apps.lib.helpers import upload_helpers


class MediaMixinTest(ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_media_mixin_creates_attributes(self):
        for prop in [
            ('host', models.CharField),
            ('virtual_path', models.CharField),
            ('file_name_orig', models.CharField),
            ('content_type', models.CharField),
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = type(self.model)._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
        self.assertTrue(hasattr(self.model, 'groups'))
        self.assertTrue(hasattr(self.model, 'filter_fields'))

    def test_get_absolute_path(self):
        # Using the method to generate the absolute path. Good not to
        # hardcode b/c this path will look different on every server.
        # Was breaking on TravisCI b/c travis stores static media in a
        # different location.
        abs_path = upload_helpers.generate_absolute_path(
            self.user, self.model.model_name_plural
        )
        # abs_path = '/localground/userdata/media/tester/audio/'
        self.assertEqual(abs_path, self.model.get_absolute_path())
    
    def test_absolute_virtual_path(self):
        abs_virt_path = upload_helpers.build_media_path(
            self.model.host,
            self.model.model_name_plural,
            self.model.virtual_path + self.model.file_name_new
        )
        self.assertEqual(abs_virt_path, self.model.absolute_virtual_path())

    def test_absolute_virtual_path_orig(self):
        abs_virt_path_orig = upload_helpers.build_media_path(
            self.model.host,
            self.model.model_name_plural,
            self.model.virtual_path + self.model.file_name_orig
        )
        self.assertEqual(abs_virt_path_orig, self.model.absolute_virtual_path_orig())

    def test_generate_relative_path(self):
        rel_path = upload_helpers.generate_relative_path(
            self.model.owner, self.model.model_name_plural
        )
        self.assertEqual(rel_path, self.model.generate_relative_path())

    def test_generate_absolute_path(self):
        abs_path = upload_helpers.generate_absolute_path(
            self.model.owner, self.model.model_name_plural
        )
        self.assertEqual(abs_path, self.model.generate_absolute_path())

    def test__build_media_path(self):
        path = 'test_path'
        media_path = upload_helpers.build_media_path(
            self.model.host, self.model.model_name_plural, path
        )
        self.assertEqual(media_path, self.model._build_media_path(path))

    
    def test_encrypt_url(self):
        file_name = 'test_file_name'
        # return self.virtual_path + file_name
        encrypted_url = self.model._build_media_path(self.model.virtual_path + file_name)
        self.assertEqual(encrypted_url, self.model.encrypt_url(file_name))

    def test_make_directory(self):

        # using 'ebooks' here just so we're not testing 
        # the creation of a directory that already exists
        path = upload_helpers.generate_absolute_path(
            self.user, 'ebooks'
        )
        # test that directory doesn't yet exist
        self.assertFalse(os.path.isdir(path))

        # create directory
        self.model.make_directory(path)

        # test that directory now exists
        self.assertTrue(os.path.isdir(path))

        # clean up
        os.rmdir(path)
        self.assertFalse(os.path.isdir(path))
