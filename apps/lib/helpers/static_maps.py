#!/usr/bin/env python
from os import path
import cStringIO as StringIO
from django.conf import settings
from django.http import HttpResponse
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageOps
import numpy as np
import logging
from localground.apps.lib.helpers.units import Units
from django.contrib.gis.geos import Point, LinearRing, Polygon
import mapscript
import urllib

"""
Defines 2 helper classes -- ``OutputFormat`` and ``StaticMap`` -- that help
create a static map (by either pulling from Google or CloudMade) and pasting
user-drawn annotations on top (reprojected).  Todo:  add ability to include
points, lines, and polygons on these maps too.
"""

class OutputFormat():
    """
    Look-up object to enumerate possible formats to be returned by print
    """
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
        
    def get_basemap_and_extents(self, map_type, zoom, center, width, height):
        import os, urllib, StringIO, Image
        #units.Units.add_pixels_to_latlng(center_lat, center_lng, zoom, 300, 300)
        map_url = None
        # http://api.tiles.mapbox.com/v3/{mapid}/{lon},{lat},{z}/{width}x{height}.{format}
        # http://api.tiles.mapbox.com/v3/examples.map-zr0njcqy/-73.99,40.70,13/500x300.png
        if map_type.overlay_source.name == 'mapbox':
            styleid = map_type.provider_id
            '''
            map_url = 'http://staticmaps.cloudmade.com/' + api_key + \
                '/staticmap?styleid=' + styleid + '&zoom=' + str(zoom) + \
                '&center=' + str(center.y) + ',' + str(center.x) + \
                '&size=' + str(width) + 'x' + str(height)
            '''
            map_url = 'http://api.tiles.mapbox.com/v3/{0}/{1},{2},{3}/{4}x{5}.png'
            map_url = map_url.format(map_type.provider_id, center.x, center.y, zoom, width, height)
        #if google is the map provider:
        else:
            scale_factor = 1
            if not settings.IS_GOOGLE_REGISTERED_NONPROFIT:
                zoom, width, height = zoom-1, int(width/2), int(height/2)
                scale_factor = 2
            
            map_url = map_type.wms_url + '&zoom=' + str(zoom) + '&center=' + \
                str(center.y) + ',' + str(center.x) + '&size=' + str(width) + \
                'x' + str(height) + '&scale=' + str(scale_factor)
        
        #calculate extents (returns geos Point):
        #(0,0) in pacific northwest; x = lat, y = lng
        northeast = Units.add_pixels_to_latlng(center.clone(), zoom, int(width/2), -1*int(height/2))
        southwest = Units.add_pixels_to_latlng(center.clone(), zoom, -1*int(width/2), int(height/2))
        try:
            file = urllib.urlopen(map_url)
            map_image = StringIO.StringIO(file.read()) # constructs a StringIO holding the image
            map_image = Image.open(map_image).convert('RGB')
        except IOError:
            error_image_url = 'https://chart.googleapis.com/chart?chst=d_fnote_title&chld=sticky_y|1|FF0000|l|Map%20Service%20Unavailable|'
            file = urllib.urlopen(error_image_url)
            map_image = StringIO.StringIO(file.read()) # constructs a StringIO holding the image
            map_image = Image.open(map_image).convert('RGB')
        return {
            'map_image': map_image,
            'northeast': northeast,
            'southwest': southwest
        }
        
    def get_map(self, layers, southwest=None, northeast=None, mapimages=None,
                srs=Units.EPSG_900913, height=300, width=300, format=OutputFormat.PNG,
                opacity=100, extra_layers=None, show_north_arrow=False, **kwargs):
        """
        Renders a MapServer-generated map, in the user-specified format, according
        to a set of optional key word arguments.
        """
        if layers is not None:
            self.layers.extend(layers)
        msmap = mapscript.mapObj(settings.MAP_FILE)
        
        #draw base layers:
        if extra_layers is not None:
            self.layers.extend(extra_layers)
        for n in self.layers:
            l = msmap.getLayerByName(n.provider_id) #WMS_Overlay Object
            l.status = 1
            l.opacity = opacity
        
        #set map image width and height:
        msmap.set_width(width)
        msmap.set_height(height)
        
        #turn on scale bar:
        msmap.scalebar.status = 3       # 3=code for 'embed'
        
        if show_north_arrow:
            self._add_north_arrow(msmap, height)
        
        #mapimages = [1]
        if mapimages is not None and len(mapimages) > 0:
            self._render_mapimages(msmap, mapimages, srs)
            
        #update map extents, if specified:
        if southwest is not None and northeast is not None:
            if southwest.srs != srs: southwest.transform(srs)
            if northeast.srs != srs: northeast.transform(srs)
            #west, south, east, north:
            msmap.setExtent(southwest.x, southwest.y, northeast.x, northeast.y)
            msmap.setProjection('init=epsg:%s' % (srs))  
        
        #render map image:
        map_image = msmap.draw()
        
        #convert from MapScript Image to PIL Image (for further manipulation):
        bytes = StringIO.StringIO(map_image.getBytes())
        new_image = Image.open(bytes)#.convert('RGBA')
        return_image = Image.new(mode='RGBA',size=(width,height),color=(255,255,255,0))
        return_image.paste(new_image, (0, 0), new_image)
        
        #return object    
        if format == OutputFormat.HTTP_RESPONSE:
            response = HttpResponse(mimetype="image/png")
            return_image.save(response, "PNG")
            return response
        elif format == OutputFormat.PNG:
            return return_image
        
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
        
        
        
    