import urllib, zipfile, csv
from django import test
from localground.apps.site.tests import Client, ModelMixin
from rest_framework import status
from StringIO import StringIO
from django.contrib.gis.geos import Point    
from localground.apps.site.api.tests.renderer_tests import mixins
from localground.apps.site.api.renderers.zip_renderer import ZIPRenderer
from localground.apps.site import models

class ZipMediaMixin(mixins.MediaMixin):
    
    def test_zip_is_valid(self):
        for url in self.urls:
            response = self.client_user.get(url + '?format=zip')
            data = StringIO(response.content)
            
            # Check if the zip file is not corrupted
            zip_file = zipfile.ZipFile(data, 'r')
    
            # Read all the files in the zip and check their CRCs and file headers.
            # Return the name of the first file with an error, or else return None.
            valid_if_none = zip_file.testzip()
            self.assertIsNone(valid_if_none)
            zip_file.close()
                
class ZIPRendererListTest(ZipMediaMixin, test.TestCase, ModelMixin):
    '''
    These tests test the ZIP renderer using the /api/0/photos/
    (though any endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        ZipMediaMixin.setUp(self)
        # just test data types that have media files (skip map images for now
        # because they're auto-processed:
        self.urls = {
            '/api/0/photos/': 2,
            '/api/0/audio/': 2,
            '/api/0/prints/': 2,
            '/api/0/forms/{}/data/'.format(self.record1.form.id): 8
        }

    def test_all_media_files_present_in_zip_file(self):
        for url in self.urls.keys():
            expected_count = self.urls.get(url)
            response = self.client_user.get(url + '?format=zip')
            data = StringIO(response.content)
            zip_file = zipfile.ZipFile(data, 'r')
            data = StringIO(zip_file.read('content.csv'))
            reader = csv.DictReader(data)
            
            # Check that all photo paths are in the zip file:
            file_paths = ['content.csv']
            file_path_columns = None
            num_rows = 0
            for row in reader:
                key = row.get('overlay_type')
                if 'form_' in key:
                    key = 'record'
                num_rows += 1
                file_path_columns = ZIPRenderer.PATH_FIELD_LOOKUP[key]
                for file_path_column in file_path_columns:
                    for column_header in row:
                        # "endswith" handles nested file paths, for example
                        # when record objects reference photo objects
                        if column_header.endswith(file_path_column):
                            file_paths.append(row.get(column_header))
            # Check that within the content.csv file, all file paths have
            # been changed to relative paths, and that all relative paths
            # are present in the zip file:
            self.assertTrue(len(file_path_columns) >= 2) #make sure that it found at least 2 file paths
            self.assertSetEqual(set(file_paths), set(zip_file.namelist()))
            self.assertEqual(num_rows, expected_count)
            self.assertTrue(len(zip_file.namelist()) >= (1 + len(file_path_columns)))


class ZIPRendererInstanceTest(ZipMediaMixin, test.TestCase, ModelMixin):
    
    def setUp(self):
        ModelMixin.setUp(self)
        #ZipMediaMixin.setUp(self)
        self.photo1 = self.create_photo_with_media(name="f1", tags=self.tags1, point=self.point)
        self.photo2 = self.create_photo_with_media(name="f2", tags=self.tags2, point=self.point)
        
        self.audio1 = self.create_audio_with_media(name="f1", tags=self.tags1, point=self.point)
        self.audio2 = self.create_audio_with_media(name="f2", tags=self.tags2, point=self.point)

        self.form = self.create_form_with_fields(name="Class Form", num_fields=8)
        self.form = models.Form.objects.get(id=self.form.id) #requery
        self.records = self.create_records(self.form, 8, photo=self.photo1, audio=self.audio1)
        self.record1 = self.records[0]
        self.record2 = self.records[1]
        
        self.marker1 = self.create_marker(self.user, self.project, name="f1", tags=self.tags1, point=self.point)
        self.marker2 = self.create_marker(self.user, self.project, name="f2", tags=self.tags2, point=self.point)
        
        self.urls = {
            '/api/0/projects/{}/'.format(self.project.id): 15,  # 1 project + 2 photos + 2 audio + 2 markers + 8 records
            '/api/0/markers/{}/'.format(self.marker1.id): 7     # 1 project + 2 photos + 2 audio + 2 records
        }
    def test_all_media_files_present_in_zip_file(self):
        self.create_relation(self.photo1.get_content_type(), marker=self.marker1, id=self.photo1.id, ordering=1)
        self.create_relation(self.photo2.get_content_type(), marker=self.marker1, id=self.photo2.id, ordering=2)
        self.create_relation(self.audio1.get_content_type(), marker=self.marker1, id=self.audio1.id, ordering=1)
        self.create_relation(self.audio2.get_content_type(), marker=self.marker1, id=self.audio2.id, ordering=2)
        self.create_relation(self.record1.get_content_type(), marker=self.marker1, id=self.record1.id, ordering=1)
        self.create_relation(self.record2.get_content_type(), marker=self.marker1, id=self.record2.id, ordering=2)

        for url in self.urls.keys():
            expected_count = self.urls.get(url)
            response = self.client_user.get(url + '?format=zip')
            data = StringIO(response.content)
            zip_file = zipfile.ZipFile(data, 'r')
            data = StringIO(zip_file.read('content.csv'))
            reader = csv.DictReader(data)
            
            # Check that all photo paths are in the zip file:
            file_paths = ['content.csv']
            file_path_columns = ZIPRenderer.URL_PATH_FIELDS
            num_rows = 0
            for row in reader:
                key = row.get('overlay_type')
                if 'form_' in key:
                    key = 'record'
                num_rows += 1
                for file_path_column in file_path_columns:
                    for column_header in row:
                        # "endswith" handles nested file paths, for example
                        # when record objects reference photo objects
                        if column_header.endswith(file_path_column):
                            if row.get(column_header) != '':
                                file_paths.append(row.get(column_header))
            # Check that within the content.csv file, all file paths have
            # been changed to relative paths, and that all relative paths
            # are present in the zip file:
            self.assertSetEqual(set(file_paths), set(zip_file.namelist()))
            self.assertEqual(num_rows, expected_count)
            self.assertTrue(num_rows > 6)
