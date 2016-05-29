from django import test
from localground.apps.site import models
from django.contrib.gis.geos import Point    

point = {
    "type": "Point",
    "coordinates": [12.492324113849, 41.890307434153]
}
point2 = {
    "type": "Point",
    "coordinates": [1.24232411384, 4.189030743415]
}
point3 = {
    "type": "Point",
    "coordinates": [124.002324113849, 54.18903074341]
}
line = {
    "type": "LineString",
    "coordinates": [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]
}

class MediaMixin():
    tags1 = ['dog', 'cat']
    tags2 = ['bird', 'fish']
    lat = 37.87
    lng = -122.28
    point = Point(lng, lat, srid=4326)
        
    def create_photo_with_media(self, name="f1", tags=[], point=None):
        import Image, tempfile
        image = Image.new('RGB', (100, 100))
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file)
        geojson = None
        with open(tmp_file.name, 'rb') as data:
            d = {
                'name': name,
                'project_id': self.project.id,
                'media_file' : data,
                'attribution': 'Author',
                'tags' : ', '.join(tags)
            }
            if point:
                d['geometry'] = point.geojson
            
            response = self.client_user.post('/api/0/photos/', d, HTTP_X_CSRFTOKEN=self.csrf_token)
            #print response.data
            return models.Photo.objects.get(id=response.data.get("id"))