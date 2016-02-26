from StringIO import StringIO
from rest_framework import renderers


class KMLRenderer(renderers.BaseRenderer):

    """
    Renderer which serializes to KML using the existing XML renderer
    """

    media_type = 'text/plain'
    format = 'kml'
    level_sep = '.'
    headers = None

    def render(self, data, media_type=None, renderer_context=None):
        """
        Renders serialized *data* into KML.
        """
        kml_buffer = StringIO(self.get_kml(data))
        return kml_buffer.getvalue()

    def get_kml(self, data):
        """
        Returns a well-formatted KML string
        """
        prolog = '<?xml version="1.0" encoding="UTF-8"?>'
        namespace = 'http://www.opengis.net/kml/2.2'
        root = '<kml xmlns="{}">'.format(namespace)
        root_close = '</kml>'
        placemarks = []
        for obj in data.get('results'):
            name = '<name>{}</name>'.format(obj['name'])
            media_type = obj['overlay_type']
            link = ''
            cdata = ''
            if media_type == 'photo':
                link = '<img src="{}" /><br />'.format(obj['file_path_orig'])
                cdata = '<![CDATA[\n{}\n]]>'.format(link)
            description = '<description>\n{}\n{}\n</description>'.format(cdata, obj['caption'])
            coord = obj['geometry']['coordinates']
            point = '<Point>\n<coordinates>{},{},0</coordinates>\n</Point>'.format(coord[0], coord[1])
            placemark = '<Placemark>\n{}\n{}\n{}\n</Placemark>'.format(name, description, point)
            placemarks.append(placemark)
        kml = '{}\n{}\n{}\n{}\n'.format(prolog, root, '\n'.join(placemarks), root_close)
        return kml

    #     csv_buffer = StringIO()
    #     csv_writer = csv.writer(csv_buffer)
    #     if data.get('results'):
    #         rows = self.get_rows(data.get('results'))
    #     else:
    #         rows = self.flatten_dict(data, data.keys())
    #     for row in rows:
    #         csv_writer.writerow([
    #             e.encode('utf-8') if isinstance(e, basestring) else self.prepare_cell(e)
    #             for e in row
    #         ])
    #     return csv_buffer.getvalue()

    # The functions below were copied from CSVRenderer
    # def prepare_cell(self, val):
    #     '''
    #     If the data structure is nested, take the key element out of the
    #     dictionary, so that the user will be able to do a join.
    #     '''
    #     if isinstance(val, dict):
    #         try:
    #             return val['username']
    #         except Exception:
    #             try:
    #                 return val['id']
    #             except Exception:
    #                 try:
    #                     return val['name']
    #                 except Exception:
    #                     pass
    #     return val

    # def get_row(self, d, keys):
    #     row = []
    #     for k in keys:
    #         if k in ['lat', 'lng'] and d.get('point'):
    #             row.append(d.get('point').get(k))
    #         else:
    #             row.append(d.get(k))
    #     return row

    # def get_rows(self, l):
    #     rows, keys = [], []
    #     for elem in l:
    #         if len(keys) == 0:
    #             keys = sorted(elem.keys())
    #             if 'point' in keys:
    #                 keys.append('lat')
    #                 keys.append('lng')
    #                 keys.remove('point')
    #             rows.append(keys)
    #         rows.append(self.get_row(elem, keys))
    #     return rows

    # def flatten_dict(self, d, keys):
    #     if isinstance(keys, set):
    #         keys = sorted(keys)
    #     row, rows = [], []
    #     rows.append(keys)
    #     rows.append(self.get_row(d, keys))
    #     return rows
