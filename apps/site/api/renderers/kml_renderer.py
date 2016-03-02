from StringIO import StringIO
from rest_framework import renderers


class KMLRenderer(renderers.BaseRenderer):

    """
    Renderer which serializes to KML using the existing XML renderer
    """

    media_type = 'application/xml'
    format = 'kml'
    level_sep = '.'
    headers = None

    def render(self, data, media_type=None, renderer_context=None):
        """
        Renders serialized *data* into KML.
        """
        kml_buffer = StringIO(self.build_kml(data))
        return kml_buffer.getvalue()

    def build_kml(self, data):
        """
        Returns a well-formatted KML string
        """
        kml = KML()
        datapoints = data.get('results')
        for datapoint in datapoints:
            if (not datapoint['geometry']) or (not datapoint['geometry']['coordinates']):
                continue
            name = KML.as_node('name', [datapoint['name']])
            cdata = KML.wrap_cdata(datapoint['overlay_type'], datapoint['file_path_orig'])
            description = KML.as_node('description', [cdata, datapoint['caption']])
            coord = KML.get_coord(datapoint['geometry'])
            point = KML.as_node('Point', [coord])
            placemark = KML.as_node('Placemark', [name, description, point])
            kml.append(placemark)
        return kml.get_kml()

class KML():
    """
    Simplified KML encoder only for limited features for Local Ground data export API
    """

    prolog = '<?xml version="1.0" encoding="UTF-8"?>'
    namespace = 'http://www.opengis.net/kml/2.2'
    root = '<kml xmlns="{}">'.format(namespace)
    closing_root = '</kml>'
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
    def wrap_cdata(datatype, url, url_msg='Link to attached media'):
        opening = '<![CDATA['
        closing = ']]>'
        html = ''
        if datatype == 'photo':
            html = '<img src="{}" /><br />'.format(url)
        else:
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
