#!/usr/bin/env python
import os
from os import path
from django.conf import settings
from django.conf import settings
from django.http import HttpResponse
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageOps
from localground.apps.lib.helpers.units import Units
from django.contrib.gis.geos import Point, LinearRing, Polygon
import cStringIO as StringIO
import logging, mapscript, urllib, json

class OutputFormat():

    '''
    Look-up object to enumerate possible formats to be returned by print
    '''
    PNG = 1
    HTTP_RESPONSE = 2
    
class StaticMap():
    """
    Creates static map (based on a pretty long set of possible
    options).  Reads the MapServer configuration file, and renders maps
    according to user-specified preferences.
    Helpful reference:  http://mapserver.org/mapscript/mapscript.html for swig
    """
    #http://caladapt/ows/ms.fcgi?request=getMap&layers=coastal_flood,sealevelrise,county_dark&format=aggpng24&version=1.1.1&height=512&width=512&srs=epsg%3A4326&bbox=-124.625,31.875,-113,44
    
    def __init__(self):
        """
        Initializes the object with an initial set of default parameters.
        """
        
        self.MAPSERVER_URL = settings.SERVER_URL + '/ows/ms.fcgi?format=aggpng24&version=1.1.1'
        self.layer_name = None
        self.source_srs = Units.EPSG_4326
        self.layers = [] #['hillshade_region', 'hillshade_ca', 'county_dark', 'cities']
        self.south = None
        self.west = None
        self.north = None
        self.east = None
        
    def get_basemap(self, map_type, zoom, center, width, height):
        import os, urllib, StringIO, Image, time
        map_url = None
        total_tries = 1
        tries = 0
        if map_type.overlay_source.name == 'mapbox':
            zoom = zoom - 1 #this is a workaround to a mapbox bug:
            map_url = map_type.static_url + "?access_token=" + os.environ.get('MAPBOX_API_KEY', settings.MAPBOX_API_KEY)
            map_url = map_url.format(x=center.x, y=center.y, z=zoom, w=width, h=height)
            
        #if google is the map provider:
        elif map_type.overlay_source.name == 'stamen':
            map_url = map_type.static_url.format(x=center.x, y=center.y, z=zoom, w=width, h=height)
            # extra step for STAMEN: get map image from JSON object:
            file = urllib.urlopen(map_url)
            data = json.loads(file.read())
            map_url = data[0].get('image')
            total_tries = 3
            time.sleep(2) # delay for stamen map b/c URL returned before image exists
        else:
            map_url = map_type.static_url.format(x=center.x, y=center.y, z=zoom, w=width, h=height)

        # This '3 tries' while loop accounts for the fact that in the
        # Stamen static map print, the path is sometimes returned well
        # before the file exists on the server. So, after each failure,
        # it waits 2 seconds and tries again:
        while tries < total_tries:
            try:
                f = urllib.urlopen(map_url)
                map_image = StringIO.StringIO(f.read()) # constructs a StringIO holding the image
                map_image = Image.open(map_image)
                map_image = map_image.convert('RGB')
                tries += 1
                break
            except IOError:
                print('Error getting image. Trying again...')
                tries += 1
                time.sleep(2)
        return map_image
        
    def _render_mapimages(self, msmap, mapimages, srs):
        for mapimage in mapimages:
            mapimage_layer = mapscript.layerObj()
            mapimage_layer.name = mapimage.uuid
            mapimage_layer.type = mapscript.MS_LAYER_RASTER
            mapimage_layer.status = 1
            mapimage_layer.data = mapimage.processed_map_filesystem()
            southwest = mapimage.processed_image.southwest
            northeast = mapimage.processed_image.northeast
            #southwest = mapimage.source_print.southwest
            #northeast = mapimage.source_print.northeast
            if southwest.srs != srs: southwest.transform(srs)
            if northeast.srs != srs: northeast.transform(srs)
            #west, south, east, north:
            mapimage_layer.setExtent(southwest.x, southwest.y, northeast.x, northeast.y)
            mapimage_layer.setProjection('init=epsg:%s' % (srs)) 
            msmap.insertLayer(mapimage_layer)
        
    def _add_north_arrow(self, msmap, map_height):
        north_arrow_layer = mapscript.layerObj()
        north_arrow_layer.transform = False
        north_arrow_layer.name = 'north_arrow'
        north_arrow_layer.type = mapscript.MS_LAYER_POINT
        north_arrow_layer.status = 1
        new_class = mapscript.classObj()
        new_style = mapscript.styleObj()
        new_style.setSymbolByName(msmap, 'northarrow1')

        li = msmap.insertLayer(north_arrow_layer)
        ci = msmap.getLayer(li).insertClass(new_class)
        si = msmap.getLayer(li).getClass(ci).insertStyle(new_style)
        point = mapscript.pointObj()
        
        #place north arrow at the bottom of the image:
        point.x = 30
        point.y = map_height-30
        north_arrow_layer.addFeature(point.toShape())
        
    def _draw_extents_as_rectangle(self, msmap):
        #generate a new temporary layer and draw a polygon on it:
        new_layer = mapscript.layerObj()
        new_layer.name = 'temp'
        new_layer.type = mapscript.MS_LAYER_POLYGON
        new_layer.status = 1
        new_class = mapscript.classObj()
        
        #generate a new style object:
        new_style = mapscript.styleObj()
        c = mapscript.colorObj()
        c.red = 50 #218
        c.green = 50 #124
        c.blue = 50 #12
        new_style.outlinecolor = c
        new_style.width = 2
        li = msmap.insertLayer(new_layer)
        ci = msmap.getLayer(li).insertClass(new_class)
        si = msmap.getLayer(li).getClass(ci).insertStyle(new_style)
        box = mapscript.rectObj(self.west, self.south, self.east, self.north)
        new_layer.addFeature(box.toPolygon())
        
    @classmethod
    def draw_border(cls, img, border_width, color='black'):
        width, height = img.size
        width_new = int(width) + 2*border_width
        height_new = int(height) + 2*border_width
        img_new = Image.new('RGB', (width_new, height_new), '#FFFFFF')
        draw = ImageDraw.Draw(img_new) # Create a draw object
        draw.rectangle((0, 0, width+2*border_width, height + 2*border_width), fill=color)
        img_new.paste(img, (border_width, border_width))
        return img_new
    
    @classmethod
    def generate_qrcode(cls, uuid, num, path, size, border_width):
        qr_url = 'http://chart.apis.google.com/chart?cht=qr&chld=Q|0'
        qr_url += '&chl=' + uuid + '_' + str(num)
        qr_url += '&chs=' + str(size) + 'x' + str(size)
        file = urllib.urlopen(qr_url)
        qr_image = StringIO.StringIO(file.read()) # constructs a StringIO holding the image
        qr_image = Image.open(qr_image).convert('RGB')
        qr_image = StaticMap.draw_border(qr_image, 2, color='white')
        qr_image = StaticMap.draw_border(qr_image, border_width)
        qr_image.save(path + '/qr_' + str(num) + '.jpg')
        return qr_image
        
        
        
    