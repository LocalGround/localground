from StringIO import StringIO
from rest_framework import renderers
import zipfile
import base64
import os
from django.conf import settings
from . import CSVRenderer
import csv
import simplejson as json


class ZIPRenderer(renderers.BaseRenderer):

    """
    Renderer which serializes to ZIP file
    """

    media_type = 'application/zip'
    format = 'zip'
    level_sep = '.'
    headers = None
    LOOKUP = {
        "photo": "photos",
        "audio": "audio",
        "map-image": "map-images",
        "record": "records",
        "print": "prints"
    }
    URL_PATH_FIELDS = [
        'path_marker_lg',
        'file_path_orig',
        'path_medium',
        'path_large',
        'path_marker_sm',
        'path_medium_sm',
        'path_small',
        'file_path',
        'overlay_path'
    ]
        

    def render(self, data, media_type=None, renderer_context=None):
        """
        Renders serialized *data* into ZIP.
        """
        # get data spreadsheet
        csv_renderer = CSVRenderer()
        spreadsheet = csv_renderer.render(data)
        if spreadsheet:
            zip_file = self.build_zip(data, spreadsheet)
            return zip_file
        else:
            return None
        
    def get_abs_path(self, row, key):
        """
        Decodes the URL from serializer and returns the 
        absolute file path on the server
        """
        file_path = row.get(key)[:-1]
        file_path = file_path.split("/")[-1]
        file_path = base64.b64decode(file_path)
        return file_path
        
    def make_relative_path(self, row, key):
        """
        Converts absolute file path to a relative path that the zip file
        has access to
        """
        file_path = self.get_abs_path(row, key)
        folder = self.LOOKUP.get(row.get("overlay_type"))
        file_path = file_path.split(folder + '/')[1]
        file_path = file_path.split('#')[0]
        return folder + '/' + file_path

    def build_zip(self, raw_data, spreadsheet):
        """
        Returns absolute path to the ZIP file contianing requested media files
        """
        dataset = None
        children = raw_data.get('children')
        z = None
        if 'results' in raw_data:
            # list of simple type: photos, audio, or print
            dataset = raw_data.get('results')
        elif 'overlay_type' in raw_data and raw_data.get('overlay_type') == 'project':
            # instance of complex type: projects
            # Hmmmm: Wondering here if we should actually go ahead and re-query the original objects
            # and work with the raw data, so that we make the spreadsheet in a less hacky way (and
            # include more file paths than we include in the typical renderer, including the original
            # files).
            dataset = []
            for key in children:
                dataset += children.get(key).get('data')
            #dataset = raw_data['children']['photos']['data'] + raw_data['children']['audio']['data']
        elif 'overlay_type' in raw_data and raw_data.get('overlay_type') in ['photo', 'audio', 'map-image', 'print', 'record']:
            # instance of simple type: photos, audio, or print
            dataset = [raw_data]
        else:
            # not defined
            return None
        zip_file_str = StringIO()
        zip_file = zipfile.ZipFile(zip_file_str, 'w')
        for data in dataset:
            # media_file is original file name
            # file_name is how LG stores a media file
            media_type = self.LOOKUP.get(data.get('overlay_type'))
            source_file_path = ''
            if media_type in ['photos', 'audio']:
                source_file_path = os.path.join(settings.USER_MEDIA_ROOT, 'media', data.get('owner'), media_type, data.get('file_name'))
            elif media_type == 'map-images':
                source_file_path = os.path.join(settings.USER_MEDIA_ROOT, 'media', data.get('owner'), media_type, data.get('uuid'), data.get('file_name'))
            else:
                # skip other types
                continue
            target_file_path = os.path.join(media_type, data.get('media_file'))
            zip_file.write(source_file_path, target_file_path)
        # replace url paths with local file paths in the spreadsheet
        # columns to modify: path_marker_lg, file_path_orig, path_medium, path_large, path_marker_sm, path_medium_sm, path_small, file_path
        dict_spreadsheet = csv.DictReader(StringIO(spreadsheet))
        dict_keys = []
        rows_spreadsheet = []
        for row in dict_spreadsheet:
            media_type = None
            if 'overlay_type' in row:
                if row.get('overlay_type') in ['photo', 'map-image', 'record', 'audio']:
                    media_type  = self.LOOKUP.get(row.get('overlay_type'))
            for key in row:
                dict_keys.append(key)
                if key in self.URL_PATH_FIELDS and row.get(key):
                    file_path = self.make_relative_path(row, key)
                    row[key] = file_path
            orig_file_name = ''
            if 'media_file' in row:
                orig_file_name = row.get('media_file')
            row['media_file'] = '{}/{}'.format(media_type, orig_file_name)
            rows_spreadsheet.append(row)
        dict_keys = list(set(dict_keys))
        spreadsheet_buffer = StringIO() # final product of the spreadsheet
        csv_writer = csv.DictWriter(spreadsheet_buffer, dict_keys)
        csv_writer.writeheader()
        for row in rows_spreadsheet:
            csv_writer.writerow(row)
        # before close the zip file, include spreadsheet in the archive
        zip_file.writestr('content.csv', spreadsheet_buffer.getvalue())
        zip_file.close()
        return zip_file_str.getvalue()
