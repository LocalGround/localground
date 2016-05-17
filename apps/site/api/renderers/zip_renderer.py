from StringIO import StringIO
from rest_framework import renderers
import zipfile
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

    def build_zip(self, raw_data, spreadsheet):
        """
        Returns absolute path to the ZIP file contianing requested media files
        """
        dataset = None
        z = None
        if 'results' in raw_data:
            # list of simple type: photos, audio, or print
            dataset = raw_data.get('results')
        elif 'overlay_type' in raw_data and raw_data['overlay_type'] == 'project':
            # instance of complex type: projects
            dataset = raw_data['children']['photos']['data'] + raw_data['children']['audio']['data']
        elif 'overlay_type' in raw_data and raw_data['overlay_type'] in ['photo', 'audio', 'print']:
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
            media_type = data['overlay_type']
            if media_type == 'photo':
                media_type = 'photos'
            source_file_path = ''
            if media_type == 'photos' or media_type == 'audio':
                source_file_path = os.path.join(settings.USER_MEDIA_ROOT, 'media', data['owner'], media_type, data['file_name'])
            elif media_type == 'print':
                source_file_path = os.path.join(settings.USER_MEDIA_ROOT, 'prints', data['uuid'], 'Print_{}.pdf'.format(data['uuid']))
                if data['map_title'] == '':
                    data['map_title'] = 'Untitled'
                data['media_file'] = '{} {}.pdf'.format(data['id'], data['map_title'])
            else:
                # skip other types
                continue
            target_file_path = os.path.join(media_type, data['media_file'])
            zip_file.write(source_file_path, target_file_path)
        # replace url paths with local file paths in the spreadsheet
        # columns to modify: path_marker_lg, file_path_orig, path_medium, path_large, path_marker_sm, path_medium_sm, path_small, file_path
        url_cols = ['path_marker_lg', 'file_path_orig', 'path_medium', 'path_large', 'path_marker_sm', 'path_medium_sm', 'path_small', 'file_path']
        dict_spreadsheet = csv.DictReader(StringIO(spreadsheet))
        dict_keys = []
        rows_spreadsheet = []
        for row in dict_spreadsheet:
            media_type = None
            if 'overlay_type' in row:
                # expected values of overlay_type: photo, audio, print
                media_type = row['overlay_type']
                # target values of media_type: photos, audio, prints
                if media_type in ['photo', 'print']:
                    media_type += 's'
            for key in row:
                dict_keys.append(key)
                if key in url_cols and row[key]:
                    row[key] = media_type
            orig_file_name = ''
            if 'media_file' in row:
                orig_file_name = row['media_file']
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
