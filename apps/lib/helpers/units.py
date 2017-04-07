#!/usr/bin/env python
import logging
import math
from django.contrib.gis.geos import Point

class Units():
    """
    Helper class for various units conversions.
    """
    #the numeric values can be arbitrary, or have meaning (as for the projections)
    MILLIMETERS = 1
    INCHES = 2
    CELCIUS = 3
    FAHRENHEIT = 4
    METERS = 5
    ACRES = 6
    PIXELS = 7
    POINTS = 8 #as in print
    NANOMETERSxE2 = 9 #before grids are divided by 10,000
    CENTIMETERS = 10
    KILOMETERS = 11
    EPSG_4326 = 4326        # WGS84
    EPSG_900913 = 900913    #Google's 'pixel' projection
    EPSG_3310 = 3310        #California Teale Albers
    
    # all of the pixel / latlng conversion code adapted from Bing Maps site:
    # http://msdn.microsoft.com/en-us/library/bb259689.aspx
    # bless them for publishing their code
    earth_radius = 6378137
    min_lat = -85.05112878
    max_lat = 85.05112878
    min_lng = -180
    max_lng = 180
    
    def __init__(self, input_units, output_units):
        self.input_units = input_units
        self.output_units = output_units
    
    def convert(self, val):
        if self.input_units is None or self.output_units is None:
            return val
        elif self.input_units == Units.MILLIMETERS and self.output_units == Units.INCHES:
            return self.millimeters_to_inches(val)
        elif self.input_units == Units.MILLIMETERS and self.output_units == Units.CENTIMETERS:
            return self.millimeters_to_centimeters(val)
        elif self.input_units == Units.NANOMETERSxE2 and self.output_units == Units.INCHES:
            return self.millimeters_to_inches(val/10000)
        elif self.input_units == Units.CELCIUS and self.output_units == Units.FAHRENHEIT:
            return self.to_fahrenheit(val)
        elif self.input_units == Units.PIXELS and self.output_units == Units.POINTS:
            return self.pixel_to_point(val)
        elif self.input_units == Units.METERS and self.output_units == Units.ACRES:
            return self.sq_meters_to_acres(val)
        elif self.input_units == Units.METERS and self.output_units == Units.KILOMETERS:
            return self.sq_meters_to_kilometers(val)
        elif self.input_units in [Units.EPSG_4326, Units.EPSG_900913, Units.EPSG_3310]:
            return self.reproject_point(self.input_units, self.output_units, val)
        else:
            raise NotImplementedError('No conversion method defined')

    def convert_list(self, vals, fn=None):
        """Convert a list or a nested list of values."""
        convert = fn or self.convert
        try:
            nested = iter(vals[0])
        except TypeError:
            return [convert(val) for val in vals]

        converted = []
        for row in vals:
            converted.append([convert(val) for val in row])
        return converted
    
    # TODO: implemented staticmethods for now as these should just be module
    # level functions but don't want to break stuff right now.
    @staticmethod
    def to_inches(val):
        return int(round(float(val)*0.0393700787, 0))
    
    @staticmethod
    def millimeters_to_inches(val):
        return round(float(val)*0.0393700787, 3)
      
    @staticmethod
    def millimeters_to_centimeters(val):
        #return self.millimeters_to_inches(val)
        return round(float(val)*0.10, 3)
        
    @staticmethod
    def to_fahrenheit(val):
        #logging.info('to_fahrenheit: ')
        #logging.info(val)
        return (float(val)*9/5) + 32
    
    @staticmethod
    def sq_meters_to_acres(val):
        return int(val/4046.82)
        
    @staticmethod
    def sq_meters_to_kilometers(val):
        return val/1000.0
        
    @staticmethod
    def pixel_to_point(pix):
        #return pix*6/9
        #return pix*.8
        #return pix*.4925
        return pix*.7
        
    @staticmethod
    def reproject_point(input_epsg_code, output_epsg_code, point):
        '''
        Re-projects poinf from source to destination projection.  This can also be done
        with GDAL, and could be switched if preferrable.
        point param is a dictionary in the form:  { 'lng': -124.625, 'lat': 31.875 }
        Test Query:  select ST_AsGeoJSON(transform(geomfromtext('POINT(' || -124.625 || ' ' || 31.875 || ')', 4326), 3310)) as point
        '''
        
        from django.db import connection, transaction
        import simplejson as json
        
        lng, lat = point['lng'], point['lat']
        cursor = connection.cursor()
    
        # Data modifying operation - commit required
        cursor.execute("select ST_AsGeoJSON(transform(geomfromtext('POINT(' || %s || ' ' || %s || ')', %s), %s)) as point",
                       [lng, lat, input_epsg_code, output_epsg_code])
        row = cursor.fetchone()
        val = json.loads(row[0])
        return { 'lng': val['coordinates'][0], 'lat': val['coordinates'][1] }
    
    @staticmethod    
    def clip(n, min_value, max_value):
        #clips a number to the specified minimum and maximum values
        return min(max(n, min_value), max_value)
    
    @staticmethod 
    def map_size(zoom_level):
        #returns the map width and height in pixels
        return 256 << zoom_level + 1

    '''@staticmethod   
    def latlng_to_pixel(lat, lng, zoom_level):
        lat   = Units.clip(lat, Units.min_lat, Units.max_lat)
        lng   = Units.clip(lng, Units.min_lng, Units.max_lng)
        #print 'latlng_to_pixel:', lat, lng, zoom_level
        x = (lng + 180) / 360 
        sin_lat = math.sin(lat * math.pi / 180)
        y = 0.5 - math.log((1 + sin_lat) / (1 - sin_lat)) / (4 * math.pi)
        map_size = Units.map_size(zoom_level)
        pixel_x = Units.clip(x * map_size + 0.5, 0, map_size - 1)
        pixel_y = Units.clip(y * map_size + 0.5, 0, map_size - 1)
        #print 'pixelX / pixelY:', pixelX, pixelY
        return [pixel_x, pixel_y]'''
       
    @staticmethod   
    def latlng_to_pixel(point, zoom_level):
        lat   = Units.clip(point.y, Units.min_lat, Units.max_lat)
        lng   = Units.clip(point.x, Units.min_lng, Units.max_lng)
        x = (lng + 180) / 360 
        sin_lat = math.sin(lat * math.pi / 180)
        y = 0.5 - math.log((1 + sin_lat) / (1 - sin_lat)) / (4 * math.pi)
        map_size = Units.map_size(zoom_level)
        x = Units.clip(x * map_size + 0.5, 0, map_size - 1)
        y = Units.clip(y * map_size + 0.5, 0, map_size - 1)
        return (x, y)

    '''@staticmethod 
    def pixel_to_latlng(pixel_x, pixel_y, zoom_level):
        # (in WGS-84 coordinates)
        map_size = Units.map_size(zoom_level)
        x = (Units.clip(pixel_x, 0, map_size - 1) / map_size) - 0.5
        y = 0.5 - (Units.clip(pixel_y, 0, map_size - 1) / map_size)
        #print 'pixel_to_latlng:', x, y
        lat = 90 - 360 * math.atan(math.exp(-y * 2 * math.pi)) / math.pi
        lng = 360 * x
        return [lng, lat]'''
        
    
    @staticmethod 
    def pixel_to_latlng(x, y, zoom_level):
        map_size = Units.map_size(zoom_level)
        x = (Units.clip(x, 0, map_size - 1) / map_size) - 0.5
        y = 0.5 - (Units.clip(y, 0, map_size - 1) / map_size)
        lat = 90 - 360 * math.atan(math.exp(-y * 2 * math.pi)) / math.pi
        lng = 360 * x
        return Point(lng, lat, srid=Units.EPSG_4326) #WGS-84 coordinates
    
    
    '''@staticmethod 
    def add_pixels_to_latlng(lat, lng, zoom_level, x, y):
        pix = Units.latlng_to_pixel(lat, lng, zoom_level)
        pix[0]   = pix[0] + x
        pix[1]   = pix[1] + y
        return Units.pixel_to_latlng(pix[0], pix[1], zoom_level)'''
        
    @staticmethod 
    def add_pixels_to_latlng(point, zoom_level, x, y):
        pix = Units.latlng_to_pixel(point, zoom_level)
        x = pix[0] + x
        y = pix[1] + y
        return Units.pixel_to_latlng(x, y, zoom_level)
