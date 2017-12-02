from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from django.contrib.gis.geos import GEOSGeometry
from localground.apps.site.tests import Client, ModelMixin

def get_metadata():
    return {
        'caption': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False,
                         'type': 'field'},
        'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        'extras': {'read_only': False, 'required': False, 'type': 'json'},
        'form': {'read_only': True, 'required': False, 'type': 'field'}
    }

class DataMixin(object):
    Point = {
        "type": "Point",
        "coordinates": [12.492324113849, 41.890307434153]
    }
    LineString = {
        "type": "LineString",
        "coordinates": [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]
    }
    Polygon = {
        "type": "Polygon",
        "coordinates": [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                         [100.0, 1.0], [100.0, 0.0]]]
    }
    Crazy1 = {
        "type": "Polygon1",
        "coordinates": [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                         [100.0, 1.0], [100.0, 0.0]]]
    }
    Crazy2 = {
        "type": "Polygon",
        "coordinates": [[[100.0, 0.0, 6, 8], [101.0, 0.0], [101.0, 1.0],
                         [100.0, 1.0], [100.0, 0.0]]]
    }
    ExtrasGood = '''{
        "source": "http://google.com",
        "video": "youtube.com",
        "order": 5
    }'''
    ExtrasBad = '''{
        "source": "http://google.com",
        "video",
        "order": 5
    }'''

class ApiMarkerListTest(test.TestCase, ViewMixinAPI, DataMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.view = views.MarkerWAttrsList.as_view()
        self.metadata = get_metadata()
        self.form = self.create_form()
        self.markerwattrs = self.create_marker_w_attrs(self.user, self.project, form=self.form)
        self.urls = ['/api/0/forms/%s/data/' % self.form.id]

    def tearDown(self):
        # delete method also removes files from file system:
        models.Photo.objects.all().delete()
        models.Audio.objects.all().delete()

    def test_page_500_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_user.get(url)
            #print(response.data)
            self.assertEqual(
                response.status_code,
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        for url in self.urls:
            response = self.client_user.get(url, {
                'project_id': self.project.id
            })
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    '''
    def test_metadata_only_available_with_flag(self, **kwargs):
        response = self.client_user.get(
            self.urls[0], {
                'marker_with_media_arrays': True,
                'project_id': self.project.id
            }
        )
        m = response.data.get("results")[0]
        self.assertIsNone(m.get("update_metadata"))

        response = self.client_user.get(
            self.urls[0], {
                'include_metadata': True,
                'project_id': self.project.id
            }
        )
        m = response.data.get("results")[0]
        self.assertIsNotNone(m.get("update_metadata"))
    '''
    '''
    def test_arrays_available_when_flag_exists(self):
        # create some associations:
        self.photo1 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)
        self.create_relation(self.markerwattrs, self.photo1)
        self.create_relation(self.markerwattrs, self.audio1)
        response = self.client_user.get(
            self.urls[0], {
                'marker_with_media_arrays': True,
                'project_id': self.project.id
            }
        )
        markerwattrs = response.data.get("results")[0]
        self.assertEqual(len(markerwattrs.get('photo_array')), 1)
        self.assertEqual(len(markerwattrs.get('audio_array')), 1)
        self.assertTrue('map_image_array' in markerwattrs)

        # clean up:
        self.delete_relation(self.markerwattrs, self.photo1)
        self.delete_relation(self.markerwattrs, self.audio1)
    '''
    def test_bad_json_creates_fails(self, **kwargs):
        # 1. define a series of bad JSON dictionaries
        for d in [
            {'geometry': self.Crazy1},
            {'geometry': self.Crazy2},
            {'extras': self.ExtrasBad}
        ]:
            params = {
                'name': 'New Marker Name',
                'caption': 'Test description',
                'geometry': self.Point,
                'project_id': self.project.id,
                'extras': self.ExtrasGood
            }
            # 2. update the params dictionary with the invalid dictionary entry
            params.update(d)
            for i, url in enumerate(self.urls):
                url = url + '?project_id={0}'.format(self.project.id)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode(params),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST)

    def test_create_marker_point_line_poly_using_post(self, **kwargs):
        for i, url in enumerate(self.urls):
            name = 'New Marker 1'
            description = 'Test description1'
            for k in ['Point', 'LineString', 'Polygon']:
                geom = getattr(self, k)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode({
                        'geometry': geom,
                        'name': name,
                        'caption': description,
                        'project_id': self.project.id,
                        'extras': self.ExtrasGood
                    }),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                if response.status_code != status.HTTP_201_CREATED:
                    print('196: ', response.data)
                    print('196: ', response.data)
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
                new_marker = models.MarkerWithAttributes.objects.all().order_by('-id',)[0]
                self.assertEqual(new_marker.name, name)
                self.assertEqual(new_marker.description, description)
                self.assertEqual(
                    new_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))
                self.assertEqual(k, new_marker.geometry.geom_type)
                self.assertEqual(new_marker.project.id, self.project.id)
                self.assertEqual(
                    new_marker.extras, json.loads(self.ExtrasGood)
                )


class APIMarkerWAttrsInstanceTest(test.TestCase, ViewMixinAPI, DataMixin):
    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.view = views.MarkerWAttrsInstance.as_view()
        self.metadata = get_metadata()
        self.markerwattrs = self.create_marker_w_attrs(self.user, self.project)
        self.urls = ['/api/0/forms/%s/data/%s/' % \
            (self.markerwattrs.form.id, self.markerwattrs.id)]

    #def tearDown(self):
        # delete method also removes files from file system:
        models.Photo.objects.all().delete()
        models.Audio.objects.all().delete()

    def test_something(self):
        self.assertAlmostEqual(1, 1)

    def test_bad_json_update_fails(self, **kwargs):
        # 1. define a series of bad JSON dictionaries
        for d in [
            {'geometry': self.Crazy1},
            {'geometry': self.Crazy2},
            {'extras': self.ExtrasBad}
        ]:
            params = {
                'name': 'New Marker Name',
                'caption': 'Test description',
                'geometry': self.Point,
                'extras': self.ExtrasGood
            }
            # 2. update the params dictionary with the invalid dictionary entry
            params.update(d)
            for i, url in enumerate(self.urls):
                response = self.client_user.put(
                    url,
                    data=urllib.urlencode(params),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST)


    def test_update_marker_using_patch(self, **kwargs):
        for k in ['Point', 'LineString', 'Polygon']:
            geom = getattr(self, k)
            for url in self.urls:
                response = self.client_user.patch(
                    url,
                    data=urllib.urlencode({'geometry': geom}),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded"
                )
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                updated_marker = models.MarkerWithAttributes.objects.get(id=self.markerwattrs.id)
                self.assertEqual(
                    updated_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))

    def test_delete_marker(self, **kwargs):
        marker_id = self.markerwattrs.id
        form_id = self.markerwattrs.form.id

        # ensure marker exists:
        models.MarkerWithAttributes.objects.get(id=marker_id)

        # delete marker:
        response = self.client_user.delete(
            '/api/0/forms/%s/data/%s/' % (form_id, marker_id),
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.MarkerWithAttributes.objects.get(id=marker_id)
            # throw assertion error if marker still in database
            print 'Marker not deleted'
            self.assertEqual(1, 0)
        except models.MarkerWithAttributes.DoesNotExist:
            # trigger assertion success if marker is removed
            self.assertEqual(1, 1)

        def test_child_serializer(self, **kwargs):
            self.photo1 = self.create_photo(self.user, self.project)
            self.audio1 = self.create_audio(self.user, self.project)
            self.create_relation(self.markerwattrs, self.photo1)
            self.create_relation(self.markerwattrs, self.audio1)

            response = self.client_user.get(self.url)
            self.assertEqual(len(response.data['children']['photos']['data']), 1)
            self.assertEqual(len(response.data['children']['audio']['data']), 1)

            # clean up:
            self.delete_relation(self.markerwattrs, self.photo1)
            self.delete_relation(self.markerwattrs, self.audio1)


'''
OrderedDict([
    ('url', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', True), (u'label', u'Url')])), 
    
    ('id', OrderedDict([(u'type', u'integer'), (u'required', False), (u'read_only', True), (u'label', u'ID')])), 
    
    ('name', OrderedDict([(u'type', u'string'), (u'required', False), (u'read_only', False), (u'label', u'Name'), (u'max_length', 255)])), 
    
    ('caption', OrderedDict([(u'type', 'memo'), (u'required', False), (u'read_only', False), (u'label', u'caption')])), 
    
    ('overlay_type', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', True), (u'label', u'Overlay type')])), 
    
    ('tags', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', False), (u'label', u'tags'), (u'help_text', u'Tag your object here')])), 
    
    ('owner', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', True), (u'label', u'Owner')])), 
    
    ('project_id', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', False), (u'label', u'Project id'), (u'choices', [{u'display_name': u'652. My First Project', u'value': u'652'}, {u'display_name': u'653. Test Project', u'value': u'653'}])])), 
    
    ('geometry', OrderedDict([(u'type', 'geojson'), (u'required', False), (u'read_only', False), (u'label', u'Geometry'), (u'help_text', u'Assign a GeoJSON string')])), 
    
    ('extras', OrderedDict([(u'type', 'json'), (u'required', False), (u'read_only', False), (u'label', u'Extras'), (u'help_text', u'Store arbitrary key / value pairs here in JSON form. Example: {"key": "value"}')])), 
    
    ('form', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', True), (u'label', u'Form')]))])

OrderedDict([
    ('url', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', True), (u'label', u'Url')])), 

    ('id', OrderedDict([(u'type', u'integer'), (u'required', False), (u'read_only', True), (u'label', u'ID')])), 
    
    ('name', OrderedDict([(u'type', u'string'), (u'required', False), (u'read_only', False), (u'label', u'Name'), (u'max_length', 255)])), 
    
    ('caption', OrderedDict([(u'type', 'memo'), (u'required', False), (u'read_only', False), (u'label', u'caption')])), 
    
    ('overlay_type', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', True), (u'label', u'Overlay type')])), 
    
    ('tags', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', False), (u'label', u'tags'), (u'help_text', u'Tag your object here')])), 
    
    ('owner', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', True), (u'label', u'Owner')])), 
    
    ('data_url', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', True), (u'label', u'Data url')])), 
    
    ('fields_url', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', True), (u'label', u'Fields url')])), 
    
    ('project_id', OrderedDict([(u'type', u'field'), (u'required', True), (u'read_only', False), (u'label', u'Project id'), (u'choices', [{u'display_name': u'664. My First Project', u'value': u'664'}, {u'display_name': u'665. Test Project', u'value': u'665'}])])), 
    
    ('fields', OrderedDict([(u'type', u'field'), (u'required', False), (u'read_only', True), (u'label', u'Fields')]))])


'''