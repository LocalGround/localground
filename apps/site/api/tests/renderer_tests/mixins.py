from django import test
from localground.apps.site import models
from django.contrib.gis.geos import Point    

point = { "type": "Point", "coordinates": [12.49, 41.89] }
point2 = { "type": "Point", "coordinates": [1.24, 4.19] }
point3 = { "type": "Point", "coordinates": [124.00, 54.19] }
line = { "type": "LineString", "coordinates": [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]] }

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
            return models.Photo.objects.get(id=response.data.get("id"))
        
    def create_audio_with_media(self, name="f1", tags=[], point=None):
        import tempfile, wave, random, struct
        tmp_file = tempfile.NamedTemporaryFile(suffix='.wav')
        noise_output = wave.open(tmp_file, 'w');
        noise_output.setparams((2, 2, 44100, 0, 'NONE', 'not compressed'))
        values = []
        SAMPLE_LEN = 44100 * 5
        for i in range(0, SAMPLE_LEN):
            value = random.randint(-32767, 32767)
            packed_value = struct.pack('h', value)
            values.append(packed_value)
        noise_output.writeframes(''.join(values))
        noise_output.close()

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
            
            response = self.client_user.post('/api/0/audio/', d, HTTP_X_CSRFTOKEN=self.csrf_token)
            return models.Audio.objects.get(id=response.data.get("id"))
    
    def create_records(self, form, num_records, photo=None, audio=None):
        records = []
        for n in range(0, num_records):
            records.append(
                self.insert_form_data_record(
                    form=self.form,
                    project=self.project,
                    photo=photo,
                    audio=audio
                )
            )
        return records
    
