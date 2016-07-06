from StringIO import StringIO
from rest_framework import renderers
import zipfile
import base64
import os
from django.conf import settings
from . import CSVRenderer
import csv

class ZIPRenderer(renderers.BaseRenderer):
    """
    Renderer which serializes to ZIP file
    """
    media_type = 'application/zip'
    format = 'zip'
    level_sep = '.'
    headers = None
    
    PATH_FIELD_LOOKUP = {
        'photo': [
            'file_path_orig',
            'path_large',
            'path_medium',
            'path_medium_sm',
            'path_small',
            'path_marker_lg',
            'path_marker_sm'
        ],
        'audio': ['file_path_orig', 'file_path'],
        'map-image': ['overlay_path', 'file_path'],
        'record': [
            'file_path',
            'file_name_medium',
            'file_name_medium_sm',
            'file_name_small'
        ],
        'print': ['pdf', 'thumb']
    }
    URL_PATH_FIELDS = []
    for key in PATH_FIELD_LOOKUP:
        URL_PATH_FIELDS += PATH_FIELD_LOOKUP[key]
    URL_PATH_FIELDS = list(set(URL_PATH_FIELDS))
    
    def render(self, data, media_type=None, renderer_context=None):
        """
        Renders serialized *data* into ZIP.
        """
        # get data spreadsheet
        csv_renderer = CSVRenderer()
        spreadsheet = csv_renderer.render(data)
        if spreadsheet:
            # piggyback on the data processing / formatting 
            # of the existing spreadsheet render
            zip_file = self.build_zip_from_spreadsheet(spreadsheet)
            return zip_file
        else:
            return None
        
    def get_media_folder_name(self, overlay_type):
        if overlay_type == 'audio':
            return overlay_type
        return overlay_type + 's'
    
    def get_abs_path(self, row, key):
        """
        Decodes the URL from serializer and returns the 
        absolute file path on the server:
        """
        file_path = row.get(key)[:-1]
        file_path = file_path.split("/")[-1]
        try:
            file_path = base64.b64decode(file_path)
        except:
            raise Exception("Could not b64decode path {}".format(file_path), row.get(key))
        file_path = file_path.split('#')[0] #removes the hash (used to ensure no caching for media files)
        if not file_path:
            return None
        return file_path
        
    def make_relative_path_for_csv(self, row, key):
        """
        Converts absolute file path to a relative path that the zip file
        has access to:
        """
        file_path = self.get_abs_path(row, key)
        if not file_path:
            return None
        
        folder = self.get_media_folder_name(row.get("overlay_type"))
        file_path = file_path.split('/')[-1]
        return '{}/{}'.format(folder, file_path)

    def add_media_to_zip(self, zip_file, row, key):
        """
        Adds any URL media to the zip file:
        """
        abs_file_path = self.get_abs_path(row, key)
        if not abs_file_path:
            return None
        
        source_file_path = '{}{}'.format(settings.FILE_ROOT, abs_file_path)
        folder = self.get_media_folder_name(row.get("overlay_type"))
        target_file_path = os.path.join(folder, source_file_path.split("/")[-1])
        if target_file_path not in zip_file.namelist():
            zip_file.write(source_file_path, target_file_path)

    def build_zip_from_spreadsheet(self, spreadsheet):
        """
        Returns absolute path to the ZIP file contianing requested media files:
        """
        records = []
        zip_file_str = StringIO()
        zip_file = zipfile.ZipFile(zip_file_str, 'w')
        reader = csv.DictReader(StringIO(spreadsheet))
        header_cells = reader.fieldnames
        
        # Loop through, add media files to the zip file, and
        # update media paths to relative paths:
        for row in reader:
            for key in self.URL_PATH_FIELDS:
                for cell in row:
                    # "endswith" handles nested file paths, for example
                    # when record objects reference photo objects
                    if cell.endswith(key):
                        self.add_media_to_zip(zip_file, row, cell)
                        row[cell] = self.make_relative_path_for_csv(row, cell)
            records.append(row)

        # Output resulting spreadsheet:
        spreadsheet_buffer = StringIO() # final product of the spreadsheet
        csv_writer = csv.DictWriter(spreadsheet_buffer, fieldnames=header_cells)
        csv_writer.writeheader()
        for row in records:
            csv_writer.writerow(row)

        # Add spreadsheet to zip file, close, and return:
        zip_file.writestr('content.csv', spreadsheet_buffer.getvalue())
        zip_file.close()
        return zip_file_str.getvalue()
