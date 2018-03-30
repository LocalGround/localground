from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from localground.apps.site.api.fields.list_field import convert_tags_to_list


def get_metadata():
    return {
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        "id": {'read_only': True, 'required': False, 'type': 'integer'},
        "name": {'read_only': False, 'required': False, 'type': 'string'},
        "caption": {'read_only': False, 'required': False, 'type': 'memo'},
        'overlay_type': {
            'type': 'field', 'required': False, 'read_only': True},
        "tags": {'read_only': False, 'required': False, 'type': 'field'},
        "owner": {'read_only': True, 'required': False, 'type': 'field'},
        "sharing_url": {'type': 'field', 'required': False, 'read_only': True},
        "center": {'read_only': False, 'required': True, 'type': 'geojson'},
        "basemap": {'read_only': False, 'required': True, 'type': 'field'},
        "zoom": {'read_only': False, 'required': False, 'type': 'integer'},
        "panel_styles": {
            'read_only': False, 'required': False, 'type': 'json'},
        "project_id": {'read_only': False, 'required': False, 'type': 'field'}
    }


class ApiMapListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.url = '/api/0/maps/'
        self.urls = [self.url]
        self.model = models.StyledMap
        self.view = views.MapList.as_view()
        self.metadata = get_metadata()

    def tearDown(self):
        models.StyledMap.objects.all().delete()

    def __get_generic_post_params(self):
        name = 'New Map!'
        description = 'New map description'
        zoom = 4
        center = {
            "type": "Point",
            "coordinates": [
                -122.27640407752006,
                37.85713522119835
            ]
        }
        sharing_url = 'newmap'
        return {
            'name': name,
            'caption': description,
            'zoom': zoom,
            'center': json.dumps(center),
            'basemap': 1,
            'project_id': self.project.id
        }

    def test_create_map_post_no_datasource_flags_yields_error(self, **kwargs):
        params = self.__get_generic_post_params()
        response = self.client_user.post(
            self.url,
            data=json.dumps(params),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        msg = 'Either create_new_dataset should be set to True '
        msg += 'or data_sources should contain a list of valid dataset IDs'
        self.assertEqual(msg, response.data[0])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_map_post_create_new_dataset_makes_dataset(self, **kwargs):
        params = self.__get_generic_post_params()
        params['create_new_dataset'] = 1
        dataset_count_initial = len(models.Form.objects.all())
        response = self.client_user.post(
            self.url,
            data=json.dumps(params),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        styled_map = self.model.objects.all().order_by('-id',)[0]
        dataset = models.Form.objects.all().order_by('-id',)[0]
        layer = styled_map.layers[0]
        self.assertEqual(styled_map.name, params['name'])
        self.assertEqual(styled_map.description, params['caption'])
        self.assertEqual(styled_map.zoom, params['zoom'])
        self.assertEqual(styled_map.project_id, self.project.id)
        self.assertEqual(styled_map.basemap.id, params['basemap'])

        # check that a single new layer was attached:
        self.assertEqual(len(styled_map.layers), 1)

        # check that a new dataset was created
        self.assertEqual(
            dataset_count_initial + 1, len(models.Form.objects.all()))

        # check that the layer is attached to the dataset:
        self.assertEqual(layer.dataset, dataset)

        # check that the display field has been set:
        self.assertEqual(layer.display_field, dataset.fields[0])

    def test_create_map_attach_new_datasets(self, **kwargs):
        params = self.__get_generic_post_params()
        ds1 = self.create_form()
        ds2 = self.create_form()
        ds3 = self.create_form()
        params['data_sources'] = json.dumps([
            'form_{0}'.format(ds1.id),
            'form_{0}'.format(ds2.id),
            'form_{0}'.format(ds3.id)
        ])
        dataset_count_initial = len(models.Form.objects.all())
        response = self.client_user.post(
            self.url,
            data=json.dumps(params),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        styled_map = self.model.objects.all().order_by('-id',)[0]
        self.assertEqual(len(styled_map.layers), 3)
        self.assertEqual(styled_map.layers[0].dataset, ds1)
        self.assertEqual(styled_map.layers[1].dataset, ds2)
        self.assertEqual(styled_map.layers[2].dataset, ds3)


class ApiMapInstanceTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.map = self.create_styled_map()
        self.url = '/api/0/maps/%s/' % self.map.id
        self.urls = [self.url]
        self.view = views.MapInstance.as_view()
        self.metadata = get_metadata()

        self.metadata.update({
            'layers': {'read_only': True, 'required': False, 'type': 'field'},
            'layers_url': {'read_only': True, 'required': False, 'type': 'field'},
        })


    '''
    def _check_children(self, children):
        self.assertTrue(not children is None)
        for k in ['photos', 'audio', 'markers', 'map_images']:
            self.assertTrue(not children.get(k) is None)
            self.assertTrue(isinstance(children.get(k).get('update_metadata'), dict))
            self.assertTrue(isinstance(children.get(k).get('overlay_type'), basestring))
            self.assertTrue(isinstance(children.get(k).get('data'), list))
            self.assertTrue(isinstance(children.get(k).get('id'), basestring))
            self.assertTrue(isinstance(children.get(k).get('name'), basestring))

    def test_get_project_with_marker_counts(self, **kwargs):
        self.create_marker(self.user, self.project)
        response = self.client_user.get(self.url)
        children = response.data.get("children")
        self._check_children(children)

        #check counts:
        marker = children.get('markers').get('data')[0]
        self.assertTrue(marker.has_key('photo_count'))
        self.assertTrue(marker.has_key('audio_count'))
        self.assertTrue(marker.has_key('map_image_count'))

    def test_get_project_with_marker_arrays(self, **kwargs):
        self.create_marker(self.user, self.project)
        response = self.client_user.get(self.url, { 'marker_with_media_arrays': 1 })
        children = response.data.get("children")
        self._check_children(children)

        #check arrays:
        marker = children.get('markers').get('data')[0]
        self.assertTrue(marker.has_key('photo_array'))
        self.assertTrue(marker.has_key('audio_array'))
        self.assertTrue(marker.has_key('map_image_array'))
    '''
    def test_update_project_using_put(self, **kwargs):
        name, description = 'New Map Name', 'Test description'
        basemap = 1
        center = {
            "type": "Point",
            "coordinates": [
                -122.27640407752006,
                37.85713522119835
            ]
        }
        slug = 'newmap'
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'name': name,
                'caption': description,
                'basemap': basemap,
                'center': json.dumps(center),
                'slug': slug
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        print response.data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_map = models.StyledMap.objects.get(id=self.map.id)
        self.assertEqual(updated_map.name, name)
        self.assertEqual(updated_map.description, description)

    def test_update_project_using_patch(self, **kwargs):
        import json
        name = 'Dummy name'
        response = self.client_user.patch(self.url,
                                          data=urllib.urlencode({'name': name}),
                                          HTTP_X_CSRFTOKEN=self.csrf_token,
                                          content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_map = models.StyledMap.objects.get(id=self.map.id)
        self.assertEqual(updated_map.name, name)

    def test_delete_project(self, **kwargs):
        map_id = self.map.id
        # ensure project exists:
        models.StyledMap.objects.get(id=map_id)

        # delete project:
        response = self.client_user.delete(self.url,
                                           HTTP_X_CSRFTOKEN=self.csrf_token
                                           )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.Project.objects.get(id=map_id)
            # throw assertion error if project still in database
            print 'Project not deleted'
            self.assertEqual(1, 0)
        except models.Project.DoesNotExist:
            # trigger assertion success if project is removed
            self.assertEqual(1, 1)

'''
('IDEAL', {
    'layers': [],
    'project_id': 5,
    'name': u'Oakland Map',
    'tags': [],
    'url': 'http://testserver/api/0/maps/2/',
    'layers_url': 'http://localhost:7777/api/0/maps/2/layers/',
    'overlay_type': 'styled_map',
    'center': {u'type': u'Point', u'coordinates': [5.0, 23.0]},
    'slug': u'',
    'caption': None,
    'zoom': 3,
    'owner': u'tester',
    'panel_styles': None,
    'basemap': 1,
    'id': 2,
    'sharing_url': u''})

('ACTUAL', {
    'layers': [],
    'project_id': 9,
    'name': u'New Map Name',
    'tags': [],
    'url': 'http://testserver/api/0/maps/4/',
    'layers_url': 'http://localhost:7777/api/0/maps/4/layers/',
    'overlay_type': 'styled_map',
    'center': {u'type': u'Point', u'coordinates': [-122.27640407752006, 37.85713522119835]}, 'slug': u'newmap',
    'caption': u'Test description',
    'zoom': 17,
    'owner': u'tester',
    'panel_styles': None,
    'basemap': 1,
    'id': 4,
    'sharing_url': u'newmap'})

'url': {'read_only': True, 'required': False, 'type': 'field'},
    "id": {'read_only': True, 'required': False, 'type': 'integer'},
    "name": {'read_only': False, 'required': False, 'type': 'string'},
    "caption": {'read_only': False, 'required': False, 'type': 'memo'},
    "overlay_type":{ 'type': 'field', 'required': False, 'read_only': True },
    "tags": {'read_only': False, 'required': False, 'type': 'field'},
    "owner": {'read_only': True, 'required': False, 'type': 'field'},
    "slug": {'read_only': False, 'required': True, 'type': 'slug'},
    "sharing_url": { 'type': 'field', 'required': False, 'read_only': True },
    "center": {'read_only': False, 'required': True, 'type': 'geojson' },
    "basemap": {'read_only': False, 'required': True, 'type': 'field'},
    "zoom": {'read_only': False, 'required': False, 'type': 'integer'},
    "panel_styles": {'read_only': False, 'required': False, 'type': 'json'},
    "project_id": {'read_only': False, 'required': False, 'type': 'field'}
'''
