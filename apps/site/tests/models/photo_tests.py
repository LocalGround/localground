from django import test
from localground.apps.site.views import profile
from localground.apps.site import models
from localground.apps.site.tests import ModelMixin
from rest_framework import status
import urllib

class PhotoModelTest(test.TestCase, ModelMixin):

    # To run test:
    # $ python manage.py test localground.apps.site.tests.models.PhotoModelTest    
    def setUp(self):
        ModelMixin.setUp(self)

    def tearDown(self):
        #delete method also removes files from file system:
        for photo in models.Photo.objects.all():
            photo.delete()
        
    def test_photo_file_thumbnail_generator_works(self, **kwargs):
        import os
        photo = self.create_photo(self.user, self.project, with_file=True)
        media_path = photo.get_absolute_path()
        self.assertTrue(os.path.exists('%s%s' % (media_path, photo.file_name_large)))
        self.assertTrue(os.path.exists('%s%s' % (media_path, photo.file_name_medium)))
        self.assertTrue(os.path.exists('%s%s' % (media_path, photo.file_name_medium_sm)))
        self.assertTrue(os.path.exists('%s%s' % (media_path, photo.file_name_small)))
        self.assertTrue(os.path.exists('%s%s' % (media_path, photo.file_name_marker_lg)))
        self.assertTrue(os.path.exists('%s%s' % (media_path, photo.file_name_marker_sm)))
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

        #check that the dimensions are as they should be:
        self.assertEqual(width, 200)
        self.assertEqual(height, 100)
        
        #rotate photo to the right:
        rotate_function(self.user)
        img_path = '%s%s' % (photo.get_absolute_path(), photo.file_name_orig)
        img = Image.open(img_path)
        (width, height) = img.size
        
        #check that photo has rotated 90 degrees
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
    
        
        
