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
        # before close the zip file, include spreadsheet in the archive
        zip_file.writestr('content.csv', spreadsheet)
        zip_file.close()
        return zip_file_str.getvalue()
