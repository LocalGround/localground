from StringIO import StringIO
from rest_framework import renderers
import zipfile
import os
from django.conf import settings


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
        zip_file = self.build_zip(data)
        return zip_file

    def build_zip(self, raw_data):
        """
        Returns absolute path to the ZIP file contianing requested media files
        """
        dataset = None
        output_name = 'data'
        z = None
        if 'overlay_type' in raw_data and raw_data['overlay_type'] == 'project':
            # instance of complex type: projects
            # dataset = raw_data['children']['photos']['data'] + raw_data['children']['audio']['data'] + raw_data['children']['markers']['data']
            pass
        elif 'results' in raw_data:
            # list of simple type: photos, audio, or markers
            # dataset = raw_data.get('results')
            pass
        else:
            # instance of simple type: photos, audio, or markers
            dataset = [raw_data]
            output_name = raw_data['name'].split('.')[0]
        # temp_dir = tempfile.mkdtemp(dir = settings.TEMP_DIR)
        # zip_file_path = os.path.join(settings.TEMP_DIR, temp_dir, '{}.{}'.format(output_name, 'zip'))
        zip_file_str = StringIO()
        zip_file = zipfile.ZipFile(zip_file_str, 'w')
        # zip_file = zipfile.ZipFile(zip_file_path, 'w')
        for data in dataset:
            # media_file is original file name
            # file_name is how LG stores a media file
            if (not data['media_file']) or (not data['file_name']):
                continue
            media_type = data['overlay_type']
            if data['overlay_type'] == 'photo':
                media_type = 'photos'
            target_file_path = os.path.join(settings.USER_MEDIA_ROOT, 'media', data['owner'], media_type, data['file_name'])
            zip_file.write(target_file_path, data['media_file'])
        zip_file.close()
        return zip_file_str.getvalue()
