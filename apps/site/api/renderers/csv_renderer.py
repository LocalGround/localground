import csv
from StringIO import StringIO
from rest_framework import renderers


class CSVRenderer(renderers.BaseRenderer):

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
        '''
        dataset = None
        if 'results' in raw_data:
            # Zip Renderer for lists:
            dataset = raw_data.get('results')
        elif 'overlay_type' in raw_data:
            # Zip Renderer for single objects:
            if raw_data.get('overlay_type') == 'project':
                dataset = [] #todo: include project attributes also
                children = raw_data.get('children')
                for key in children:
                    dataset += children.get(key).get('data')
            else:
                dataset = [raw_data]
        else:
            # not defined
            return None
        '''
        if data.get('children'):
            # instance of complex type: project
            children = data.get('children')
            dict_project = []
            rows = []
            key_project = set([])
            for media in children:
                data_media = { 'results': children.get(media).get('data') }
                if len(data_media['results']) < 1:
                    # skip if no data for the media type
                    continue
                # get csv for each media type
                csv_media = self.render(data_media, media_type, renderer_context)
                dict_media = csv.DictReader(StringIO(csv_media))
                for row in dict_media:
                    # collect all the columns
                    key_project = key_project | set(row.keys())
                    # collect all the data entries
                    rows.append(row)
            # a complete row might have empty cells due to differences in models
            for row in rows:
                complete_row = row
                for key in key_project:
                    if key not in complete_row:
                        complete_row[key] = ''
                dict_project.append(complete_row)
            # output
            csv_writer = csv.DictWriter(csv_buffer, key_project)
            csv_writer.writeheader()
            for row in dict_project:
                csv_writer.writerow(row)
            return csv_buffer.getvalue()
        else:
            # simple type
            rows = None
            if data.get('results'):
                # list
                rows = self.get_rows(data.get('results'))
                csv_writer = csv.writer(csv_buffer)
                for row in rows:
                    csv_writer.writerow([
                        e.encode('utf-8') if isinstance(e, basestring) else self.prepare_cell(e)
                        for e in row
                    ])
            else:
                # instance
                csv_writer = csv.DictWriter(csv_buffer, data.keys())
                csv_writer.writeheader()
                csv_writer.writerow(data)
            return csv_buffer.getvalue()

    def prepare_cell(self, val):
        '''
        If the data structure is nested, take the key element out of the
        dictionary, so that the user will be able to do a join.
        '''
        if isinstance(val, dict):
            try:
                return val['username']
            except Exception:
                try:
                    return val['id']
                except Exception:
                    try:
                        return val['name']
                    except Exception:
                        pass
        return val

    def get_row(self, d, keys):
        row = []
        for k in keys:
            if k in ['lat', 'lng'] and d.get('point'):
                row.append(d.get('point').get(k))
            else:
                row.append(d.get(k))
        return row

    def get_rows(self, l):
        rows, keys = [], []
        for elem in l:
            if len(keys) == 0:
                keys = sorted(elem.keys())
                if 'point' in keys:
                    keys.append('lat')
                    keys.append('lng')
                    keys.remove('point')
                rows.append(keys)
            rows.append(self.get_row(elem, keys))
        return rows

    def flatten_dict(self, d, keys):
        if isinstance(keys, set):
            keys = sorted(keys)
        row, rows = [], []
        rows.append(keys)
        rows.append(self.get_row(d, keys))
        return rows
