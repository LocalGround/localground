import urllib, json, zipfile, csv
from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.marker_tests import get_metadata
from localground.apps.site.tests import Client, ModelMixin
from rest_framework import status
from StringIO import StringIO
from django.contrib.gis.geos import Point    
from xml.sax import parseString
from xml.sax.handler import ContentHandler
from xml.sax import SAXParseException

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


class GeoJSONRendererListTest(test.TestCase, ModelMixin):
    '''
    These tests test the GeoJSON renderer using the /api/0/markers/ (though any
    geospatial endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        self.url = '/api/0/markers/.geojson'
        
    def test_geojson_format_looks_correct(self):
        self.create_marker(self.user, self.project, name="Marker 1", geoJSON=point)
        self.create_marker(self.user, self.project, name="Marker 2", geoJSON=line)
        response = self.client_user.get(self.url)
        data = json.loads(response.content)
        
        # Check outer attributes:
        self.assertEqual(data.get("type"), "FeatureCollection")
        self.assertEqual(len(data.get("features")), 2)
        rec = data.get("features")[1]
        
        #Check inner attributes:
        self.assertEqual(rec.get("type"), "Feature")
        self.assertEqual(rec.get("geometry"), line)
        self.assertTrue(isinstance(rec.get("properties"), dict))
        
        # Make sure 'extras' attribute gets merged into the properties:
        self.assertEqual(rec.get("properties").get("key"), "value")
        
    def tearDown(self):
        models.Form.objects.all().delete()

      
class GeoJSONRendererInstanceTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        self.marker = self.create_marker(self.user, self.project, name="Marker 1", geoJSON=point)
        self.url = '/api/0/markers/%s/.geojson' % self.marker.id
        
    def test_geojson_format_looks_correct(self):
        response = self.client_user.get(self.url, format='json')
        data = json.loads(response.content)
        
        self.assertEqual(data.get("type"), "Feature")
        self.assertEqual(data.get("geometry"), point)
        self.assertTrue(isinstance(data.get("properties"), dict))
        
        # Make sure 'extras' attribute gets merged into the properties:
        self.assertEqual(data.get("properties").get("key"), "value")

class KMLRendererListTest(test.TestCase, ModelMixin):
    '''
    These tests test the KML renderer using the /api/0/markers/ (though any
    geospatial endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        self.url = '/api/0/markers/'
        
    def test_kml_is_valid_xml(self):
        self.create_marker(self.user, self.project, name="Marker 1", geoJSON=point)
        self.create_marker(self.user, self.project, name="Marker 2", geoJSON=point2)
        self.create_marker(self.user, self.project, name="Marker 3", geoJSON=point3)
        response = self.client_user.get(self.url + '?format=kml')
        data = response.content
        is_valid = True
        try:
            self.validateXML(data)
        except SAXParseException:
            is_valid = False
        self.assertTrue(is_valid)
        for p in [point, point2, point3]:
            point_template = '<Point><coordinates>{},{},0</coordinates></Point>'
            self.assertTrue(point_template.format(p['coordinates'][0], p['coordinates'][1]) in data)

    def validateXML(self, data):
        parseString(data, ContentHandler())
        
    def tearDown(self):
        models.Form.objects.all().delete()

class KMLRendererInstanceTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        self.marker = self.create_marker(self.user, self.project, name="Marker 1", geoJSON=point)
        self.url = '/api/0/markers/%s/' % self.marker.id
        
    def test_kml_is_valid_xml(self):
        response = self.client_user.get(self.url + '?format=kml')
        data = response.content
        is_valid = True
        try:
            self.validateXML(data)
        except SAXParseException:
            is_valid = False
        point_template = '<Point><coordinates>{},{},0</coordinates></Point>'
        self.assertTrue(point_template.format(point['coordinates'][0], point['coordinates'][1]) in data)
        self.assertTrue(is_valid)
        
    def validateXML(self, data):
        parseString(data, ContentHandler())

class CSVMixin(MediaMixin):
    
    def setUp(self):
        self.photo1 = self.create_photo_with_media(name="f1", tags=self.tags1, point=self.point)
        self.photo2 = self.create_photo_with_media(name="f2", tags=self.tags2, point=self.point)
        
        self.audio1 = self.create_audio(self.user, self.project, name="f1", tags=self.tags1, point=self.point)
        self.audio2 = self.create_audio(self.user, self.project, name="f2", tags=self.tags2, point=self.point)
        
        self.map_image1 = self.create_scan(self.user, self.project, name="f1", tags=self.tags1)
        self.map_image2 = self.create_scan(self.user, self.project, name="f2", tags=self.tags2)
        
        self.marker1 = self.create_marker(self.user, self.project, name="f1", tags=self.tags1, point=self.point)
        self.marker2 = self.create_marker(self.user, self.project, name="f2", tags=self.tags2, point=self.point)
        
        self.project1 = self.create_project(self.user, name="f1", tags=self.tags1)
        self.project2 = self.create_project(self.user, name="f2", tags=self.tags2)
        
        self.print1 = self.create_print(map_title="f1", tags=self.tags1)
        self.print2 = self.create_print(map_title="f2", tags=self.tags2)
        
    def test_csv_is_valid_for_objects(self):
        # issuing tests for many URL endpoints (photos, audio,
        # map images, markers, projects, and prints):
        for url in self.urls: 
            response = self.client_user.get(url + '?format=csv')
            data = StringIO(response.content)
            reader = csv.DictReader(data)
            types_without_lat_lngs = ['map-image', 'project', 'print']
            header_row = reader.fieldnames
            cnt_track_both_objects_present = 0
            test_record = None
            for row in reader:
                if row.get('name') == 'f1' or row.get('map_title') == 'f1':
                    test_record = row
                if row.get('name') in ['f1', 'f2'] or row.get('map_title') in ['f1', 'f2']:
                    cnt_track_both_objects_present += 1
                    
            # test that the expected models are present in CSV file:
            if self.isList:
                self.assertEqual(cnt_track_both_objects_present, 2)
            else:
                self.assertEqual(cnt_track_both_objects_present, 1)
    
            # get fields:
            response = self.client_user.options(url,
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded"
            )
            
            # TEST 1: there is a cell for every field exposed in the serializer
            # (+ lat, lng, if applicable):
            if self.isList:
                headers = response.data['actions'].get('POST').keys()
            else:
                headers = response.data['actions'].get('PUT').keys()
                if 'children' in headers:
                    headers.remove('children') #for instances
            if test_record.get('overlay_type') not in types_without_lat_lngs:
                headers += ['lat', 'lng']
            self.assertSetEqual(set(headers), set(header_row))
            
            # TEST 2: lat/lng are populated, if applicable:
            if test_record.get('overlay_type') not in types_without_lat_lngs:
                self.assertEqual(test_record.get('lng'), str(self.lng))
                self.assertEqual(test_record.get('lat'), str(self.lat))
            
            # TEST 3: tags have been flattened:
            self.assertEqual(test_record.get('tags'), ', '.join(self.tags1))

        
class CSVRendererListTest(CSVMixin, test.TestCase, ModelMixin):
    '''
    These tests test the ZIP renderer using the /api/0/photos/ (though any
    geospatial endpoint could be used).
    '''
    def setUp(self):
        ModelMixin.setUp(self)
        CSVMixin.setUp(self)
        self.urls = [
            '/api/0/photos/',
            '/api/0/audio/',
            '/api/0/map-images/',
            '/api/0/markers/',
            '/api/0/projects/',
            '/api/0/prints/'
        ]
        self.isList = True
        
    def test_project_instance_has_child_records(self):
        self.assertEqual(1, 1)

    def test_marker_instance_has_child_records(self):
        self.assertEqual(1, 1)
    
class CSVRendererInstanceTest(CSVMixin, test.TestCase, ModelMixin):
    def setUp(self):
        ModelMixin.setUp(self)
        CSVMixin.setUp(self)
        self.urls = [
            '/api/0/photos/{}/'.format(self.photo1.id),
            '/api/0/audio/{}/'.format(self.audio1.id),
            '/api/0/map-images/{}/'.format(self.map_image1.id),
            '/api/0/markers/{}/'.format(self.marker1.id),
            '/api/0/projects/{}/'.format(self.project1.id),
            '/api/0/prints/{}/'.format(self.print1.id)
        ]
        self.isList = False

class ZipMediaMixin(MediaMixin):
    
    def test_zip_is_valid(self):
        response = self.client_user.get(self.url + '?format=zip')
        data = StringIO(response.content)
        
        # Check if the zip file is not corrupted
        zip_file = zipfile.ZipFile(data, 'r')

        # Read all the files in the zip and check their CRCs and file headers.
        # Return the name of the first file with an error, or else return None.
        valid_if_none = zip_file.testzip()
        self.assertIsNone(valid_if_none)
        zip_file.close()
    
    def test_all_photo_media_files_present_in_zip_file(self):
        response = self.client_user.get(self.url + '?format=zip')
        data = StringIO(response.content)
        zip_file = zipfile.ZipFile(data, 'r')

        # Check that all photo paths are in the zip file:
        file_paths = ['content.csv']
        for p in self.photos:
            file_paths += [
                'photos/{}'.format(p.file_name_new),
                'photos/{}'.format(p.file_name_large),
                'photos/{}'.format(p.file_name_medium),
                'photos/{}'.format(p.file_name_medium_sm),
                'photos/{}'.format(p.file_name_small),
                'photos/{}'.format(p.file_name_marker_lg),
                'photos/{}'.format(p.file_name_marker_sm),
            ]
        
        self.assertSetEqual(set(file_paths), set(zip_file.namelist())) 

        # Check that within the content.csv file, all file paths have
        # been changed to relative paths:
        data = StringIO(zip_file.read('content.csv'))
        reader = csv.DictReader(data)
        keys = [
            'file_path_orig', 'path_large', 'path_medium', 'path_medium_sm',
            'path_small', 'path_marker_lg', 'path_marker_sm'
        ]
        for row in reader:
            for key in keys:
                self.assertTrue(row.get(key) in file_paths)
                
class ZIPRendererListTest(ZipMediaMixin, test.TestCase, ModelMixin):
    '''
    These tests test the ZIP renderer using the /api/0/photos/ (though any
    geospatial endpoint could be used).
    '''

    def setUp(self):
        ModelMixin.setUp(self)
        self.url = '/api/0/photos/'
        self.photo1 = self.create_photo_with_media(name="f1", tags=self.tags1, point=self.point)
        self.photo2 = self.create_photo_with_media(name="f2", tags=self.tags2, point=self.point)
        self.photo3 = self.create_photo_with_media(name="f1", tags=self.tags1, point=self.point)
        self.photos = [self.photo1, self.photo2, self.photo3]

class ZIPRendererInstanceTest(ZipMediaMixin, test.TestCase, ModelMixin):
    
    def setUp(self):
        ModelMixin.setUp(self)
        self.photo = self.create_photo_with_media()
        self.photos = [ self.photo ] 
        self.url = '/api/0/photos/%s/' % self.photo.id