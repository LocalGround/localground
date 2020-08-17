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
        "project_id": {'read_only': False, 'required': True, 'type': 'field'}
    }


class ApiMapListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.url = '/api/0/maps/?project_id={0}'.format(self.project.id)
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

    def test_403_if_no_prj_param(self, **kwargs):
        params = self.__get_generic_post_params()
        response = self.client_user.post(
            '/api/0/maps/',
            data=json.dumps(params),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_list_returns_expected_json(self):
        self.create_styled_map()
        response = self.client_user.get(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        results = response.data.get('results')[0]
        self.assertEqual(results.get('project_id'), self.project.id)
        self.assertEqual(results.get('overlay_type'), 'styled_map')
        self.assertEqual(results.get('owner'), u'tester')
        self.assertEqual(results.get('name'), u'Oakland Map')
        self.assertEqual(results.get('basemap'), 1)
        self.assertEqual(results.get('zoom'), 3)
        self.assertTrue(
            results.get('panel_styles'), models.StyledMap.default_panel_styles)
        self.assertEqual(
            results.get('center'),
            {u'type': u'Point', u'coordinates': [5.0, 23.0]})

    def test_create_map_post_no_datasource_flags_yields_error(self, **kwargs):
        params = self.__get_generic_post_params()
        response = self.client_user.post(
            self.url,
            data=json.dumps(params),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        msg = 'Either create_new_dataset should be set to True '
        msg += 'or datasets should contain a list of valid dataset IDs'
        self.assertEqual(msg, response.data[0])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_map_post_create_new_dataset_makes_dataset(self, **kwargs):
        params = self.__get_generic_post_params()
        params['create_new_dataset'] = 1
        dataset_count_initial = len(models.Dataset.objects.all())
        response = self.client_user.post(
            self.url,
            data=json.dumps(params),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        styled_map = self.model.objects.all().order_by('-id',)[0]
        dataset = models.Dataset.objects.all().order_by('-id',)[0]
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
            dataset_count_initial + 1, len(models.Dataset.objects.all()))

        # check that the layer is attached to the dataset:
        self.assertEqual(layer.dataset, dataset)

        # check that the display field has been set:
        self.assertEqual(layer.display_field, dataset.fields[0])

    def test_create_map_attach_new_datasets(self, **kwargs):
        params = self.__get_generic_post_params()
        ds1 = self.create_dataset()
        ds2 = self.create_dataset()
        ds3 = self.create_dataset()
        params['datasets'] = json.dumps([
            ds1.id, ds2.id, ds3.id
        ])
        dataset_count_initial = len(models.Dataset.objects.all())
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


map_config_metadata = {
    'displayLegend': False,
    'nextPrevButtons': True,
    'allowPanZoom': False,
    'streetview': False,
    'displayTitleCard': False,
    'titleCardInfo': {
        'header': 'hi there',
        'description': 'some description',
        'media': [1, 2, 3]
    },
    'accessLevel': models.StyledMap.Permissions.PUBLIC_SEARCHABLE
}


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
            'layers_url':
                {'read_only': True, 'required': False, 'type': 'field'},
            'panel_styles': {
                'read_only': False, 'required': False, 'type': 'json'},
            'metadata': {
                'read_only': False, 'required': False, 'type': 'json'},
            'slug': {
                'read_only': False, 'required': True, 'type': 'slug'},
            'project_id': {
                'read_only': True, 'required': True, 'type': 'field'},
            'password': {
                'read_only': False, 'required': False, 'type': 'string'}
        })

    def test_get_instance_returns_expected_json(self):
        response = self.client_user.get(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        results = response.data
        layers = results.get('layers')
        self.assertEqual(results.get('project_id'), self.project.id)
        self.assertEqual(results.get('overlay_type'), 'styled_map')
        self.assertEqual(results.get('owner'), u'tester')
        self.assertEqual(results.get('name'), u'Oakland Map')
        self.assertEqual(results.get('basemap'), 1)
        self.assertEqual(results.get('zoom'), 3)
        self.assertTrue(
            results.get('panel_styles'), models.StyledMap.default_panel_styles)
        self.assertEqual(
            results.get('center'),
            {u'type': u'Point', u'coordinates': [5.0, 23.0]})

        self.assertEqual(len(layers), 1)
        layer = layers[0]
        self.assertEqual(
            set(layer.keys()),
            set([
                'display_field', 'map_id', 'title', 'ordering',
                'overlay_type', 'dataset', 'symbols', 'url', 'group_by',
                'owner', 'id', 'metadata'])
            )
        dataset = layer.get('dataset')
        self.assertEqual(
            set(dataset.keys()),
            set(['id', 'fields', 'overlay_type', 'name'])
        )

    def test_update_map_using_put(self, **kwargs):
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
            data=urllib.parse.urlencode({
                'name': name,
                'caption': description,
                'basemap': basemap,
                'center': json.dumps(center),
                'slug': slug
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_map = models.StyledMap.objects.get(id=self.map.id)
        self.assertEqual(updated_map.name, name)
        self.assertEqual(updated_map.description, description)

    def test_update_map_using_patch(self, **kwargs):
        import json
        name = 'Dummy name'
        slug = 'my-new-map-name'
        response = self.client_user.patch(
            self.url,
            data=urllib.parse.urlencode({
                'name': name,
                'slug': slug
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_map = models.StyledMap.objects.get(id=self.map.id)
        self.assertEqual(updated_map.name, name)
        self.assertEqual(updated_map.slug, slug)

    def test_update_map_using_put(self, **kwargs):
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
            data=urllib.parse.urlencode({
                'name': name,
                'caption': description,
                'basemap': basemap,
                'center': json.dumps(center),
                'slug': slug
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_map = models.StyledMap.objects.get(id=self.map.id)
        self.assertEqual(updated_map.name, name)
        self.assertEqual(updated_map.description, description)
        self.assertEqual(updated_map.metadata, models.StyledMap.default_metadata)

    def test_update_map_metadata(self, **kwargs):
        response = self.client_user.patch(
            self.url,
            data=urllib.parse.urlencode({
                'metadata': json.dumps(map_config_metadata)
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_map = models.StyledMap.objects.get(id=self.map.id)
        self.assertEqual(updated_map.metadata, map_config_metadata)

    def test_update_map_metadata_validate_boolean_flags(self, **kwargs):
        for key in [
                'displayLegend', 'nextPrevButtons', 'allowPanZoom',
                'streetview', 'displayTitleCard'
                ]:
            metadata = map_config_metadata.copy()
            del metadata[key]
            response = self.client_user.patch(
                self.url,
                data=urllib.parse.urlencode({
                    'metadata': json.dumps(metadata)
                }),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(
                response.data.get('metadata'),
                ['The metadata property {0} must be a boolean'.format(key)]
            )

    def test_update_map_metadata_validate_access_key_good(self, **kwargs):
        metadata = map_config_metadata
        for val in [1, 2, 3]:
            metadata['accessLevel'] = val
            response = self.client_user.patch(
                self.url,
                data=urllib.parse.urlencode({
                    'metadata': json.dumps(metadata),
                    'password': '123'
                }),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded")
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_map_metadata_validate_access_key_bad(self, **kwargs):
        metadata = map_config_metadata
        for val in [4, '55']:
            metadata['accessLevel'] = val
            response = self.client_user.patch(
                self.url,
                data=urllib.parse.urlencode({
                    'metadata': json.dumps(metadata)
                }),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded")
            self.assertEqual(
                response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(
                response.data.get('metadata'),
                ['The accessLevel must be set to 1, 2, or 3.']
            )

    def test_update_map_metadata_if_password_protected_needs_password(self):
        metadata = map_config_metadata
        metadata['accessLevel'] = 3
        response = self.client_user.patch(
            self.url,
            data=urllib.parse.urlencode({
                'metadata': json.dumps(metadata)
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('metadata'),
            ['A password of at least three characters is required.']
        )

    def test_update_map_metadata_if_password_protected_needs_password(self):
        metadata = map_config_metadata
        metadata['accessLevel'] = 3
        response = self.client_user.patch(
            self.url,
            data=urllib.parse.urlencode({
                'metadata': json.dumps(metadata)
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(
            response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('metadata'),
            ['A password of at least three characters is required.']
        )

    def test_update_map_metadata_password_does_not_get_blown_away(self):
        self.map.password = '123'
        self.map.metadata['accessLevel'] = 3
        self.map.save()

        metadata = map_config_metadata
        metadata['displayTitleCard'] = True
        response = self.client_user.put(
            self.url,
            data=urllib.parse.urlencode({
                'metadata': json.dumps(metadata),
                'basemap': 1,
                'center': json.dumps({
                    "type": "Point",
                    "coordinates": [
                        -122.27640407752006,
                        37.85713522119835
                    ]
                }),
                'slug': 'here-is-a-slug'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(
            response.status_code, status.HTTP_200_OK)
        updated_map = models.StyledMap.objects.get(id=self.map.id)
        self.assertEqual(updated_map.password, '123')
        self.assertEqual(updated_map.metadata, metadata)
