import urllib
import zipfile
import csv
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
            response = self.client_user.get(
                url + '?format=zip&project_id={0}'.format(self.project.id)
            )
            data = StringIO(response.content)

            # Check if the zip file is not corrupted
            zip_file = zipfile.ZipFile(data, 'r')

            # Read all the files in the zip and check their
            # CRCs and file headers.
            # Return the name of the first file with an error,
            # or else return None.
            valid_if_none = zip_file.testzip()
            self.assertIsNone(valid_if_none)
            zip_file.close()

    def _all_media_files_present_in_zip_file(self, is_list=False):
        for url in self.urls.keys():
            expected_count = self.urls.get(url)
            response = self.client_user.get(
                url + '?format=zip&project_id={0}'.format(self.project.id)
            )
            data = StringIO(response.content)
            zip_file = zipfile.ZipFile(data, 'r')
            data = StringIO(zip_file.read('content.csv'))
            reader = csv.DictReader(data)

            # Check that all photo paths are in the zip file:
            file_paths = ['content.csv']
            num_rows = 0
            for row in reader:
                key = row.get('overlay_type')
                if 'dataset_' in key and not is_list:
                    key = 'record'
                num_rows += 1
                file_path_columns = ZIPRenderer.PATH_FIELD_LOOKUP.get(key) \
                    or []
                for file_path_column in file_path_columns:
                    for column_header in row:
                        # "endswith" handles nested file paths, for example
                        # when record objects reference photo objects
                        if column_header.endswith(file_path_column):
                            if row.get(column_header) != '':
                                file_paths.append(row.get(column_header))

            self.assertSetEqual(set(file_paths), set(zip_file.namelist()))
            self.assertEqual(num_rows, expected_count)
            if file_path_columns is ZIPRenderer.URL_PATH_FIELDS:
                self.assertTrue(num_rows > 4)
            else:
                # make sure that it found at least 2 file paths
                # print url
                # print zip_file.namelist()
                # print file_path_columns
                self.assertTrue(
                    len(zip_file.namelist()) >= (1 + len(file_path_columns))
                )


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
            '/api/0/datasets/{}/data/'.format(self.record1.dataset.id): 8
        }

    def test_all_media_files_present_in_zip_file(self):
        self._all_media_files_present_in_zip_file(is_list=True)


class ZIPRendererInstanceTest(ZipMediaMixin, test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        # ZipMediaMixin.setUp(self)
        self.photo1 = self.create_photo_with_media(
            name="f1", tags=self.tags1, point=self.point
        )
        self.photo2 = self.create_photo_with_media(
            name="f2", tags=self.tags2, point=self.point
        )

        self.audio1 = self.create_audio_with_media(
            name="f1", tags=self.tags1, point=self.point
        )
        self.audio2 = self.create_audio_with_media(
            name="f2", tags=self.tags2, point=self.point
        )

        self.dataset = self.create_dataset_with_fields(
            name="Class Dataset", num_fields=9
        )
        # self.dataset = models.Dataset.objects.get(id=self.dataset.id)  # requery
        self.record1 = self.insert_dataset_data_record(
            dataset=self.dataset,
            project=self.project,
            geoJSON=mixins.point,
            name='rec1'
        )

        self.urls = {
            # 1 project + 2 photos + 2 audio + 1 record
            '/api/0/projects/{0}/'.format(self.project.id): 1,
            # 1 project + 2 photos + 2 audio (no records)
            # '/api/0/datasets/{0}/data/{1}/'.format(
            #     self.dataset.id, self.record1.id): 5
            '/api/0/datasets/{0}/data/{1}/'.format(
                self.dataset.id, self.record1.id): 1
        }

    # def test_all_media_files_present_in_zip_file(self):
    #     self.create_relation(self.record1, self.photo1)
    #     self.create_relation(self.record1, self.photo2)
    #     self.create_relation(self.record1, self.audio1)
    #     self.create_relation(self.record1, self.audio2)
    #
    #     file_path_columns = ZIPRenderer.URL_PATH_FIELDS
    #     self._all_media_files_present_in_zip_file(is_list=False)
