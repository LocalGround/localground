from django import test
from localground.apps.site import models
from django.contrib.gis.geos import Point

point = {
    "type": "Point",
    "coordinates": [-122.28, 37.87]
}
point2 = {
    "type": "Point",
    "coordinates": [1.24, 4.19]
}
point3 = {
    "type": "Point",
    "coordinates": [124.00, 54.19]
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

    def setUp(self):
        self.photo1 = self.create_photo_with_media(
            name="f1", tags=self.tags1, point=self.point
        )
        self.photo2 = self.create_photo_with_media(
            name="f2", tags=self.tags2, point=self.point
        )

        self.audio1 = self.create_audio_with_media(
            name="f1", tags=self.tags1, point=self.point
        )
        self.audio2 = self.create_audio_with_media(
            name="f2", tags=self.tags2, point=self.point
        )

        self.dataset = self.create_dataset_with_fields(
            name="Class Dataset", num_fields=9
        )
        self.dataset = models.Dataset.objects.get(id=self.dataset.id)  # requery
        self.records = self.create_records(
            self.dataset, 8, photo=self.photo1, audio=self.audio1,
            point=self.point
        )
        self.record1 = self.records[0]

        self.record2 = self.records[1]

        # Expensive. Only run if necessary:
        self.map_image1 = self.create_mapimage(
            self.user, self.project, name="f1", tags=self.tags1,
            generate_print=True
        )
        self.map_image2 = self.create_mapimage(
            self.user, self.project, name="f2", tags=self.tags2,
            generate_print=True
        )

        self.print1 = self.map_image1.source_print
        self.print1.name = "f1"
        self.print1.tags = self.tags1
        self.print1.save()

        self.print2 = self.map_image2.source_print
        self.print2.name = "f2"
        self.print2.tags = self.tags2
        self.print2.save()

        self.project1 = self.create_project(
            self.user, name="f1", tags=self.tags1
        )
        self.project2 = self.create_project(
            self.user, name="f2", tags=self.tags2
        )

    def create_photo_with_media(self, name="f1", tags=[], point=None):
        import Image
        import tempfile
        image = Image.new('RGB', (100, 100))
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file)
        with open(tmp_file.name, 'rb') as data:
            d = {
                'name': name,
                'project_id': self.project.id,
                'media_file': data,
                'attribution': 'Author',
                'tags': ', '.join(tags)
            }
            if point:
                d['geometry'] = point.geojson

            response = self.client_user.post(
                '/api/0/photos/', d, HTTP_X_CSRFTOKEN=self.csrf_token
            )
            return models.Photo.objects.get(id=response.data.get("id"))

    def create_audio_with_media(self, name="f1", tags=[], point=None):
        import tempfile
        import wave
        import random
        import struct
        tmp_file = tempfile.NamedTemporaryFile(suffix='.wav')
        noise_output = wave.open(tmp_file, 'w')
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
                'media_file': data,
                'attribution': 'Author',
                'tags': ', '.join(tags)
            }
            if point:
                d['geometry'] = point.geojson

            response = self.client_user.post(
                '/api/0/audio/', d, HTTP_X_CSRFTOKEN=self.csrf_token
            )
            return models.Audio.objects.get(id=response.data.get("id"))

    def create_records(
            self, dataset, num_records, photo=None, audio=None, point=None):
        records = []
        for n in range(0, num_records):
            records.append(
                self.insert_dataset_data_record(
                    dataset=self.dataset,
                    project=self.project,
                    photo=photo,
                    audio=audio,
                    point=point,
                    name='f{}'.format((n+1))
                )
            )
        return records
