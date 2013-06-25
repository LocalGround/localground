import csv
from collections import defaultdict
from rest_framework.renderers import *
from StringIO import StringIO
from django.template import RequestContext
from rest_framework_csv.orderedrows import OrderedRows

class CSVRenderer(BaseRenderer):
    """
    Renderer which serializes to CSV
    """

    media_type = 'text/csv'
    format = 'csv'
    level_sep = '.'
    headers = None

    def render(self, data, media_type=None, renderer_context=None):
        """
        Renders serialized *data* into CSV. For a dictionary:
        """
        csv_buffer = StringIO()
        csv_writer = csv.writer(csv_buffer)
        if data.get('results'):
            rows = self.flatten_list(data.get('results'))
        else:
            rows = self.flatten_dict(data, data.keys())
        for row in rows:
            csv_writer.writerow([
                e.encode('utf-8') if isinstance(e, basestring) else e
                for e in row
            ])
        return csv_buffer.getvalue()

    def flatten_list(self, l):
        rows, keys = [], []
        for elem in l:
            if len(keys) == 0:
                keys = list(keys)
                keys.sort()
                rows.append(keys)  
            rows.append(self.flatten_dict(elem, keys))
        return rows
    
    def make_row(self, d, keys):
        row = []
        for k in keys:
            row.append(d.get(k))
        return row
    
    
    def flatten_dict(self, d, keys):
        if isinstance(keys, set):
            keys = list(keys)
            keys.sort()
        row, rows = [], []
        rows.append(keys)  
        for k in keys:
            row.append(d.get(k))
        rows.append(row)
        return rows
    
    