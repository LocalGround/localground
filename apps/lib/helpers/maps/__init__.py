from localground.apps.lib.helpers.units import Units

class PixelCoordinate(object):
    
    def __init__(self, x, y):
        self.x = x
        self.y = y
        
class Extents(object):
    
    @staticmethod   
    def get_extents_from_center_lat_lng(center, zoom, width, height):
        northeast = Units.add_pixels_to_latlng(center.clone(), zoom, int(width/2), -1*int(height/2))
        southwest = Units.add_pixels_to_latlng(center.clone(), zoom, -1*int(width/2), int(height/2))
        return Extents(northeast, southwest)
    
    def __init__(self, northeast, southwest):
        self.mode = 'latlng'
        self.top = northeast.y
        self.right = northeast.x
        self.bottom = southwest.y
        self.left = southwest.x
        self.northeast = northeast
        self.southwest = southwest
        
    def toPixels(self, zoom):
        self.mode = 'pixel'
        self.northeast = Units.latlng_to_pixel(self.northeast, zoom)
        self.southwest = Units.latlng_to_pixel(self.southwest, zoom)
        self.top = self.northeast[1]
        self.right = self.northeast[0]
        self.bottom = self.southwest[1]
        self.left = self.southwest[0]
    
    def toLatLng(self, zoom):
        self.mode = 'latlng'
        self.northeast = Units.pixel_to_latlng(self.northeast[1], self.northeast[0], zoom)
        self.southwest = Units.pixel_to_latlng(self.southwest[1], self.southwest[0], zoom)
        self.top = self.northeast.y
        self.right = self.northeast.x
        self.bottom = self.southwest.y
        self.left = self.southwest.x
    


