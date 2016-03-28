from StringIO import StringIO
from rest_framework import renderers


class KMLRenderer(renderers.BaseRenderer):

    """
    Renderer which serializes to KML using the existing XML renderer
    """

    media_type = 'application/vnd.google-earth.kml+xml'
    format = 'kml'
    level_sep = '.'
    headers = None

    def render(self, data, media_type=None, renderer_context=None):
        """
        Renders serialized *data* into KML.
        """
        kml_buffer = StringIO(self.build_kml(data))
        return kml_buffer.getvalue()

    def build_kml(self, raw_data):
        """
        Returns a well-formatted KML string
        """
        kml = KML()
        dataset = None
        if 'overlay_type' in raw_data and raw_data['overlay_type'] == 'project':
            # instance of complex type: projects
            dataset = raw_data['children']['photos']['data'] + raw_data['children']['audio']['data'] + raw_data['children']['markers']['data']
        elif 'results' in raw_data:
            # list of simple type: photos, audio, or markers
            dataset = raw_data.get('results')
        else:
            # instance of simple type: photos, audio, or markers
            dataset = [raw_data]
        for data in dataset:
            if (not data['geometry']) or (not data['geometry']['coordinates']):
                continue
            name = KML.as_node('name', [data['name']])
            cdata = None
            if 'file_path_orig' in data:
                cdata = KML.wrap_cdata(data['overlay_type'], data['file_path_orig'])
            description = KML.as_node('description', [cdata, data['caption']])
            coord = KML.get_coord(data['geometry'])
            point = KML.as_node('Point', [coord])
            placemark = KML.as_node('Placemark', [name, description, point])
            kml.append(placemark)
        return kml.get_kml()

class KML():
    """
    Simplified KML encoder with limited features for Local Ground data export API
    """

    prolog = '<?xml version="1.0" encoding="UTF-8"?>'
    namespace = 'http://www.opengis.net/kml/2.2'
    root = '<kml xmlns="{}"><Folder>'.format(namespace)
    closing_root = '</Folder></kml>'
    kml = ''

    def __init__(self):
        self.kml = '{}{}'.format(self.prolog, self.root)

    @staticmethod
    def as_node(tag, content=[], attriutes='', self_closing=False):
        if self_closing:
            return '<{}{} />'.format(tag, attriutes)
        opening = '<{}{}>'.format(tag, attriutes)
        closing = '</{}>'.format(tag)
        concat = ''.join([elem for elem in content if elem])
        node = '{}{}{}'.format(opening, concat, closing)
        return node

    @staticmethod
    def wrap_cdata(datatype, url, url_msg='Link to attachment'):
        opening = '<![CDATA['
        closing = ']]>'
        html = ''
        if datatype == 'photo':
            html = '<img src="{}" /><br />'.format(url)
        elif datatype != 'marker':
            html = '<a href="{}">{}</a><br />'.format(url, url_msg)
        cdata = '{}{}{}'.format(opening, html, closing)
        return cdata

    @staticmethod
    def get_coord(geom):
        opening = '<coordinates>'
        closing = '</coordinates>'
        coord = '{}{},{},0{}'.format(opening, geom['coordinates'][0], geom['coordinates'][1], closing)
        return coord

    def append(self, new_node):
        self.kml = '{}{}'.format(self.kml, new_node)
        return self.get_kml()

    def get_kml(self):
        return '{}{}'.format(self.kml, self.closing_root)
