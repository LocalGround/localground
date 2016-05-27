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
        file_path = base64.b64decode(file_path)
        file_path = file_path.split('#')[0] #removes the hash (used to ensure no caching for media files)
        return file_path
        
    def make_relative_path_for_csv(self, row, key):
        """
        Converts absolute file path to a relative path that the zip file
        has access to:
        """
        file_path = self.get_abs_path(row, key)
        folder = self.get_media_folder_name(row.get("overlay_type"))
        return '{}/{}'.format(folder, file_path.split('/')[-1])

    def add_media_to_zip(self, zip_file, row, key):
        """
        Adds any URL media to the zip file:
        """
        source_file_path = '{}{}'.format(settings.FILE_ROOT, self.get_abs_path(row, key))
        folder = self.get_media_folder_name(row.get("overlay_type"))
        target_file_path = os.path.join(folder, source_file_path.split("/")[-1])
        zip_file.write(source_file_path, target_file_path)

    def build_zip(self, raw_data, spreadsheet):
        """
        Returns absolute path to the ZIP file contianing requested media files:
        """
        zip_file_str = StringIO()
        zip_file = zipfile.ZipFile(zip_file_str, 'w')
        dict_spreadsheet = csv.DictReader(StringIO(spreadsheet))
        rows_spreadsheet = []
        header_cells = self.URL_PATH_FIELDS[:] #build master list of spreadsheet columns
        
        # Loop through, add media files to the zip file, and
        # update media paths to relative paths:
        for row in dict_spreadsheet:
            header_cells += row.keys()
            for key in self.URL_PATH_FIELDS:
                if row.get(key):
                    self.add_media_to_zip(zip_file, row, key)
                    row[key] = self.make_relative_path_for_csv(row, key)
            rows_spreadsheet.append(row)

        # Output resulting spreadsheet:
        header_cells = list(set(header_cells))
        header_cells.sort()
        spreadsheet_buffer = StringIO() # final product of the spreadsheet
        csv_writer = csv.DictWriter(spreadsheet_buffer, fieldnames=header_cells)
        csv_writer.writeheader()
        for row in rows_spreadsheet:
            csv_writer.writerow(row)

        # Add spreadsheet to zip file:
        zip_file.writestr('content.csv', spreadsheet_buffer.getvalue())
        
        # Close the zip file and return it:
        zip_file.close()
        return zip_file_str.getvalue()
