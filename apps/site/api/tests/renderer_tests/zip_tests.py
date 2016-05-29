import urllib, zipfile, csv
from django import test
from localground.apps.site.tests import Client, ModelMixin
from rest_framework import status
from StringIO import StringIO
from django.contrib.gis.geos import Point    
from localground.apps.site.api.tests.renderer_tests.mixins import MediaMixin

class ZipMediaMixin(MediaMixin):
    
    def test_zip_is_valid(self):
        response = self.client_user.get(self.url + '?format=zip')
        data = StringIO(response.content)
        
        # Check if the zip file is not corrupted
        zip_file = zipfile.ZipFile(data, 'r')

        # Read all the files in the zip and check their CRCs and file headers.
        # Return the name of the first file with an error, or else return None.
        valid_if_none = zip_file.testzip()
        self.assertIsNone(valid_if_none)
        zip_file.close()
    
    def test_all_photo_media_files_present_in_zip_file(self):
        response = self.client_user.get(self.url + '?format=zip')
        data = StringIO(response.content)
        zip_file = zipfile.ZipFile(data, 'r')

        # Check that all photo paths are in the zip file:
        file_paths = ['content.csv']
        for p in self.photos:
            file_paths += [
                'photos/{}'.format(p.file_name_new),
                'photos/{}'.format(p.file_name_large),
                'photos/{}'.format(p.file_name_medium),
                'photos/{}'.format(p.file_name_medium_sm),
                'photos/{}'.format(p.file_name_small),
                'photos/{}'.format(p.file_name_marker_lg),
                'photos/{}'.format(p.file_name_marker_sm),
            ]
        
        self.assertSetEqual(set(file_paths), set(zip_file.namelist())) 

        # Check that within the content.csv file, all file paths have
        # been changed to relative paths:
        data = StringIO(zip_file.read('content.csv'))
        reader = csv.DictReader(data)
        keys = [
            'file_path_orig', 'path_large', 'path_medium', 'path_medium_sm',
            'path_small', 'path_marker_lg', 'path_marker_sm'
        ]
        for row in reader:
            for key in keys:
                self.assertTrue(row.get(key) in file_paths)
                
class ZIPRendererListTest(ZipMediaMixin, test.TestCase, ModelMixin):
    '''
    These tests test the ZIP renderer using the /api/0/photos/ (though any
    geospatial endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        self.url = '/api/0/photos/'
        self.photo1 = self.create_photo_with_media(name="f1", tags=self.tags1, point=self.point)
        self.photo2 = self.create_photo_with_media(name="f2", tags=self.tags2, point=self.point)
        self.photo3 = self.create_photo_with_media(name="f1", tags=self.tags1, point=self.point)
        self.photos = [self.photo1, self.photo2, self.photo3]

class ZIPRendererInstanceTest(ZipMediaMixin, test.TestCase, ModelMixin):
    
    def setUp(self):
        ModelMixin.setUp(self)
        self.photo = self.create_photo_with_media()
        self.photos = [ self.photo ] 
        self.url = '/api/0/photos/%s/' % self.photo.id