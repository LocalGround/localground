# sudo pip install svgpathtools svgwrite #also requires numpy
# sudo apt-get install libffi-dev
# sudo pip install --upgrade cffi
# sudo pip install cairosvg==1.0.22
#https://pypi.python.org/pypi/svgpathtools/ 
from localground.apps.lib.externals.svgpathtools import parse_path, svg2paths, wsvg
import random
from localground.apps.lib.helpers.units import Units
from localground.apps.site import models
from django.contrib.gis.geos import Point
from localground.apps.lib.helpers import StaticMap
from localground.apps.site.models import WMSOverlay

class Icon(object):
    ICONS = {
        'circle': {
            'key': "circle",
            'name': "Circle",
            'baseWidth': 15,
            'baseHeight': 15,
            'path': 'M14,7.5c0,3.5899-2.9101,6.5-6.5,6.5S1,11.0899,1,7.5S3.9101,1,7.5,1S14,3.9101,14,7.5z',
        },
        'pin': {
            'key': "pin",
            'name': "Pin",
            'baseWidth': 15,
            'baseHeight': 15,
            'path': 'M7.5,0C5.0676,0,2.2297,1.4865,2.2297,5.2703 C2.2297,7.8378,6.2838,13.5135,7.5,15c1.0811-1.4865,5.2703-7.027,5.2703-9.7297C12.7703,1.4865,9.9324,0,7.5,0z',
            'anchor': [15  / 2, 15 / 2 ]
        },
        'square': {
            'key': "square",
            'name': "Square",
            'baseWidth': 15,
            'baseHeight': 15,
            'path': 'M13,14H2c-0.5523,0-1-0.4477-1-1V2c0-0.5523,0.4477-1,1-1h11c0.5523,0,1,0.4477,1,1v11C14,13.5523,13.5523,14,13,14z'
        },
        'triangle': {
            'key': "triangle",
            'name': "Triangle",
            'baseWidth': 15,
            'baseHeight': 15,
            'path': 'M7.5385,2 C7.2437,2,7.0502,2.1772,6.9231,2.3846l-5.8462,9.5385C1,12,1,12.1538,1,12.3077C1,12.8462,1.3846,13,1.6923,13h11.6154 C13.6923,13,14,12.8462,14,12.3077c0-0.1538,0-0.2308-0.0769-0.3846L8.1538,2.3846C8.028,2.1765,7.7882,2,7.5385,2z'
        },
        'camera': {
            'key': "camera",
            'name': "Camera",
            'baseWidth': 15,
            'baseHeight': 15,
            'path': 'M6,2C5.446,2,5.2478,2.5045,5,3L4.5,4h-2C1.669,4,1,4.669,1,5.5v5C1,11.331,1.669,12,2.5,12h10 c0.831,0,1.5-0.669,1.5-1.5v-5C14,4.669,13.331,4,12.5,4h-2L10,3C9.75,2.5,9.554,2,9,2H6z M2.5,5C2.7761,5,3,5.2239,3,5.5 S2.7761,6,2.5,6S2,5.7761,2,5.5S2.2239,5,2.5,5z M7.5,5c1.6569,0,3,1.3431,3,3s-1.3431,3-3,3s-3-1.3431-3-3S5.8431,5,7.5,5z M7.5,6.5C6.6716,6.5,6,7.1716,6,8l0,0c0,0.8284,0.6716,1.5,1.5,1.5l0,0C8.3284,9.5,9,8.8284,9,8l0,0C9,7.1716,8.3284,6.5,7.5,6.5 L7.5,6.5z'
        },
        'water': {
            'key': "water",
            'name': "Water Drop",
            'path': 'M864.626 473.162c-65.754-183.44-205.11-348.15-352.626-473.162-147.516 125.012-286.87 289.722-352.626 473.162-40.664 113.436-44.682 236.562 12.584 345.4 65.846 125.14 198.632 205.438 340.042 205.438s274.196-80.298 340.040-205.44c57.27-108.838 53.25-231.962 12.586-345.398zM738.764 758.956c-43.802 83.252-132.812 137.044-226.764 137.044-55.12 0-108.524-18.536-152.112-50.652 13.242 1.724 26.632 2.652 40.112 2.652 117.426 0 228.668-67.214 283.402-171.242 44.878-85.292 40.978-173.848 23.882-244.338 14.558 28.15 26.906 56.198 36.848 83.932 22.606 63.062 40.024 156.34-5.368 242.604z',
            'baseWidth': 1050,
            'baseHeight': 1050,
            'viewBox': '-130 -130 1200 1200',
            'width': 20,
            'height': 20
        },
        'cross': {
            'key': "cross",
            'name': "Cross",
            'baseWidth': 1050,
            'baseHeight': 1050,
            'viewBox': '-130 -130 1200 1200',
            'width': 20,
            'height': 20,
            'path': 'M 1014.66 822.66 c -0.004 -0.004 -0.008 -0.008 -0.012 -0.01 l -310.644 -310.65 l 310.644 -310.65 c 0.004 -0.004 0.008 -0.006 0.012 -0.01 c 3.344 -3.346 5.762 -7.254 7.312 -11.416 c 4.246 -11.376 1.824 -24.682 -7.324 -33.83 l -146.746 -146.746 c -9.148 -9.146 -22.45 -11.566 -33.828 -7.32 c -4.16 1.55 -8.07 3.968 -11.418 7.31 c 0 0.004 -0.004 0.006 -0.008 0.01 l -310.648 310.652 l -310.648 -310.65 c -0.004 -0.004 -0.006 -0.006 -0.01 -0.01 c -3.346 -3.342 -7.254 -5.76 -11.414 -7.31 c -11.38 -4.248 -24.682 -1.826 -33.83 7.32 l -146.748 146.748 c -9.148 9.148 -11.568 22.452 -7.322 33.828 c 1.552 4.16 3.97 8.072 7.312 11.416 c 0.004 0.002 0.006 0.006 0.01 0.01 l 310.65 310.648 l -310.65 310.652 c -0.002 0.004 -0.006 0.006 -0.008 0.01 c -3.342 3.346 -5.76 7.254 -7.314 11.414 c -4.248 11.376 -1.826 24.682 7.322 33.83 l 146.748 146.746 c 9.15 9.148 22.452 11.568 33.83 7.322 c 4.16 -1.552 8.07 -3.97 11.416 -7.312 c 0.002 -0.004 0.006 -0.006 0.01 -0.01 l 310.648 -310.65 l 310.648 310.65 c 0.004 0.002 0.008 0.006 0.012 0.008 c 3.348 3.344 7.254 5.762 11.414 7.314 c 11.378 4.246 24.684 1.826 33.828 -7.322 l 146.746 -146.748 c 9.148 -9.148 11.57 -22.454 7.324 -33.83 c -1.552 -4.16 -3.97 -8.068 -7.314 -11.414 Z'
        },
        'plus': {
            'key': "plus",
            'name': "Plus",
            'path': 'M992 384h-352v-352c0-17.672-14.328-32-32-32h-192c-17.672 0-32 14.328-32 32v352h-352c-17.672 0-32 14.328-32 32v192c0 17.672 14.328 32 32 32h352v352c0 17.672 14.328 32 32 32h192c17.672 0 32-14.328 32-32v-352h352c17.672 0 32-14.328 32-32v-192c0-17.672-14.328-32-32-32z',
            'baseWidth': 1050,
            'baseHeight': 1050,
            'viewBox': '-130 -130 1200 1200',
            'width': 20,
            'height': 20
        },
        'mic': {
            'key': "mic",
            'name': "Microphone",
            'path': 'M480 704c88.366 0 160-71.634 160-160v-384c0-88.366-71.634-160-160-160s-160 71.634-160 160v384c0 88.366 71.636 160 160 160zM704 448v96c0 123.71-100.29 224-224 224-123.712 0-224-100.29-224-224v-96h-64v96c0 148.238 112.004 270.3 256 286.22v129.78h-128v64h320v-64h-128v-129.78c143.994-15.92 256-137.982 256-286.22v-96h-64z',
            'baseWidth': 1050,
            'baseHeight': 1050,
            'viewBox': '-130 -130 1200 1200',
            'width': 20,
            'height': 20
        },
        'worm': {
            'key': "worm",
            'name': "Worm",
            'path': 'M5.494,25.875c-0.792,0-1.597-0.172-2.359-0.536c-2.735-1.306-3.902-4.569-2.605-7.309  C1.264,16.479,8.075,2.795,20.752,0.438C28.146-0.93,35.521,1.834,42.69,8.664c4.737,4.511,9.18,6.44,13.198,5.737  c6.396-1.119,11.531-8.768,12.826-11.359c1.359-2.717,4.659-3.818,7.379-2.461c2.717,1.358,3.818,4.661,2.461,7.379  c-0.305,0.61-7.623,14.978-20.771,17.276c-7.649,1.343-15.278-1.559-22.679-8.607c-4.461-4.248-8.604-6.06-12.313-5.381  c-6.107,1.115-10.969,8.683-12.327,11.505C9.516,24.722,7.545,25.875,5.494,25.875z',
            'baseWidth': 79.136,
            'baseHeight': 32.34375,
            'width': 79,
            'height': 32
        },
        'bug': {
            'key': "bug",
            'name': "Bug",
            'path': 'M1824 1088q0 26-19 45t-45 19h-224q0 171-67 290l208 209q19 19 19 45t-19 45q-18 19-45 19t-45-19l-198-197q-5 5-15 13t-42 28.5-65 36.5-82 29-97 13v-896h-128v896q-51 0-101.5-13.5t-87-33-66-39-43.5-32.5l-15-14-183 207q-20 21-48 21-24 0-43-16-19-18-20.5-44.5t15.5-46.5l202-227q-58-114-58-274h-224q-26 0-45-19t-19-45 19-45 45-19h224v-294l-173-173q-19-19-19-45t19-45 45-19 45 19l173 173h844l173-173q19-19 45-19t45 19 19 45-19 45l-173 173v294h224q26 0 45 19t19 45zm-480-576h-640q0-133 93.5-226.5t226.5-93.5 226.5 93.5 93.5 226.5z',
            'baseWidth': 2048,
            'baseHeight': 2048,
            'width': 20,
            'height': 20
        }
    }
    
    @staticmethod
    def get_icon_list():
        return Icon.ICONS.values()
    
    @staticmethod
    def get_icon_keys():
        return Icon.ICONS.keys()
    
    def __init__(self, key, **kwargs):
        # set defaults:
        self.baseWidth = 15
        self.baseHeight = 15
        self.width = 30
        self.height = 30
        self.scale = 1
        self.anchor = None
        self.fillColor = 'teal'
        self.fillOpacity = 1
        self.strokeColor = 'black'
        self.strokeOpacity = 1
        self.strokeWeight = 1
        self.viewBox = None

        props = Icon.ICONS.get(key)
        if not props:
            props = Icon.ICONS.get('circle')
            if key == 'audio':
                props['width'] = 12
                props['height'] = 12
                props['fillColor'] = '#62929E'
            elif key == 'photo':
                props['width'] = 12
                props['height'] = 12
                props['fillColor'] = '#7084c2'
            elif key in ['marker', 'record']:
                props['width'] = 23
                props['height'] = 23
                props['fillColor'] = '#ed867d'
            else:
                props['width'] = 23
                props['height'] = 23
                props['fillColor'] = '#ed867d'
        
        # apply icon properties:
        for k, v in props.iteritems():
            setattr(self, k, v)
        
        # apply kwargs:
        for k, v in kwargs.iteritems():
            setattr(self, k, v)
        
        # apply defaults for missing instance variable values:
        self.set_defaults()

    def get_scale(self):
        return 1.0 * self.width / self.baseWidth

    def get_anchor(self):
        return [self.baseWidth / 2, self.baseHeight / 2]

    def get_stroke_weight_normalized(self):
        return self.strokeWeight / self.get_scale()

    def get_viewbox(self):
        return (str(-1 * self.strokeWeight) + ' ' +
            str(-1 * self.strokeWeight) + ' ' +
            str(self.baseWidth + self.strokeWeight + 2) + ' ' +
            str(self.baseWidth + self.strokeWeight + 2)
        )
        
    def set_defaults(self):
        self.scale = self.scale or self.get_scale()
        self.anchor = self.anchor or self.get_anchor()
        self.viewBox = self.viewBox or self.get_viewbox()

class AcetateLayer(object):
    '''
------------------------------------------------------------------------
TO TEST THIS CLASS:
------------------------------------------------------------------------
$ cd /localground/apps
$ python manage.py shell

from localground.apps.lib.helpers.maps.acetate_layer import AcetateLayer
a = AcetateLayer()
    '''
    
    def __init__(self):
        from localground.apps.site import models
        self.center = Point(-122.29729, 37.86812)
        self.zoom = 14
        self.width = 1024
        self.height = 600
        self.project_id = 5
        self.svg_path = 'map_acetate.svg'
        self.acetate_path = 'map_acetate.png'
        self.basemap_path = 'map_base.png'
        self.final_path = 'map_final.png'
        self.generate_acetate_layer()
        self.generate_static_map()
        self.generate_final_map()

    def generate_acetate_layer(self):
        paths, path_attributes, icon = [], [], None
        keys = Icon.get_icon_keys()
        forms = models.Form.objects.filter(projects__id=self.project_id)
        extents = StaticMap.get_extents_from_center(self.center, self.zoom, self.width, self.height)
        extents.toPixels(self.zoom)
        layers = [
            models.Photo.objects.filter(project__id=self.project_id),
            models.Audio.objects.filter(project__id=self.project_id),
            models.Marker.objects.filter(project__id=self.project_id)
        ]
        for form in forms:
            layers.append(form.TableModel.objects.all())

        for layer in layers:
            pixels = self.get_pixel_coordinates_from_models(layer, self.zoom, extents.left, extents.top)

            for coord in pixels:
                key = layer[0]._meta.verbose_name
                icon = Icon(key, strokeWeight=1, strokeColor='white')
                paths.append(parse_path(icon.path))
                x = coord[0]
                y = coord[1]
                print(x, y)
                path_attributes.append({
                    "fill": icon.fillColor,
                    "fill-opacity": icon.fillOpacity,
                    "stroke": icon.strokeColor,
                    "stroke-width": icon.get_stroke_weight_normalized(),
                    "transform": "translate({0}, {1}) scale({2}, {3})".format(
                        x, y, icon.get_scale(), icon.get_scale()
                    )
                })
            svg_attributes = {
                'width': self.width,
                'height': self.height,
                'viewBox': '0 0 {0} {1}'.format(self.width, self.height)
            }
        wsvg(paths, attributes=path_attributes, svg_attributes=svg_attributes, filename=self.svg_path)
        self.toPNG()

    def generate_static_map(self):
        m = StaticMap()
        info = m.get_basemap_and_extents(
            WMSOverlay.objects.filter(name='Grayscale')[0], self.zoom, self.center, self.width, self.height
        )
        map_image = info.get('map_image')
        map_image.save(self.basemap_path)
        
    def generate_final_map(self):
        from PIL import Image
        basemap_image = Image.open(self.basemap_path, 'r').convert('RGBA')
        acetate_image = Image.open(self.acetate_path, 'r')
        final_image = Image.new(mode='RGBA',size=(self.width, self.height), color=(255,255,255,0))
        final_image.paste(basemap_image, (0, 0), basemap_image)
        final_image.paste(acetate_image, (0, 0), acetate_image)
        final_image.save(self.final_path)

    def get_pixel_coordinates_from_models(self, models, zoom, minXPixels, minYPixels):
        pixels = []
        for model in models:
            if model.point is not None:
                pixel = Units.latlng_to_pixel(model.point, zoom)
                pixel = (pixel[0] - minXPixels, pixel[1] - minYPixels)
                pixels.append(pixel)
        return pixels

        
    def toPNG(self):
        # first set environment variables b/c of cairo bug:
        import os
        os.environ['LANG'] = 'en_US.UTF-8'
        os.environ['LC_ALL'] = 'en_US.UTF-8'
        
        # then import cairosvg:
        import cairosvg
        cairosvg.svg2png(url=self.svg_path,
            write_to=self.acetate_path
        )