from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from localground.apps.site.api.fields.list_field import convert_tags_to_list


symbols = [
    models.Symbol.SIMPLE.to_dict()
]


def get_metadata():
    return {
        'symbols': {'read_only': True, 'required': False, 'type': 'json'},
        'group_by': {'read_only': True, 'required': False, 'type': 'string'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'title': {'read_only': False, 'required': True, 'type': 'string'},
        'dataset': {'read_only': False, 'required': False, 'type': 'field'},
        'metadata': {'read_only': True, 'required': False, 'type': 'json'},
        'map_id': {'read_only': True, 'required': False, 'type': 'field'}
    }


class ApiLayerTest(object):
    title = 'New Layer Name'

    def _test_save_layer_post(self, status_id, data):

        response = self.client_user.post(
            self.url,
            data=json.dumps(data),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status_id)

        # if it was successful, verify data:
        if status_id in [status.HTTP_201_CREATED, status.HTTP_200_OK]:
            if hasattr(self, 'obj'):
                rec = models.Layer.objects.get(id=self.obj.id)
            else:
                rec = models.Layer.objects.all().order_by('-id',)[0]
            self.assertEqual(rec.title, self.title)
            self.assertEqual(rec.dataset.id, self.dataset.id)
            self.assertEqual(rec.ordering, 2)
            for key in [
                'title', 'strokeWeight', 'rule', 'isShowing',
                'strokeOpacity', 'height', 'width', 'shape', 'strokeColor'
                    ]:
                self.assertEqual(rec.symbols[0][key], symbols[0][key])
            results = response.data
            '''
            {'display_field': u'name',
            'map_id': 1931,
            'title': u'New Layer Name',
            'ordering': 2,
            'overlay_type': u'layer',
            'dataset': {
                'fields': [OrderedDict([('id', 22387), ('col_alias', u'Name'), ('col_name', 'name'), ('extras', None), ('ordering', 1), ('data_type', u'text')]), OrderedDict([('id', 22388), ('col_alias', u'Description'), ('col_name', 'description'), ('extras', None), ('ordering', 2), ('data_type', u'text')])],
                'overlay_type': 'dataset_4755',
                'id': 4755,
                'name': u'A title'
            },
            'symbols': [{'strokeWeight': 1, 'strokeOpacity': 1, 'height': 25, 'shape': 'circle', 'fillOpacity': 1, 'strokeColor': '#ffffff', 'title': 'Untitled Symbol', 'isShowing': True, 'rule': '*', 'width': 25, 'fillColor': 'rgb(251, 154, 153)'}],
            'url': 'http://localhost:7777/api/0/maps/1931/layers/1982',
            'group_by': u'uniform',
            'owner': u'tester',
            'id': 1982,
            'metadata': {u'strokeWeight': 1, u'buckets': 4, u'isShowing': False, u'strokeOpacity': 1, u'width': 20, u'shape': u'circle', u'fillOpacity': 1, u'strokeColor': u'#ffffff', u'paletteId': 0, u'fillColor': u'#4e70d4'}}
            '''
            # print results
            self.assertEqual(results['display_field'], 'name')
            self.assertEqual(results['map_id'], self.map.id)
            self.assertEqual(results['title'], data.get('title'))
            self.assertEqual(results['ordering'], 2)
            self.assertEqual(results['overlay_type'], 'layer')
            self.assertEqual(len(results['dataset']['fields']), 2)
            self.assertEqual(results['dataset']['name'], u'A title')
            self.assertEqual(
                results['dataset']['overlay_type'],
                'dataset_{0}'.format(data['dataset']))
            self.assertEqual(results['dataset']['id'], data['dataset'])
            self.assertEqual(results['owner'], u'tester')
            self.assertEqual(results['group_by'], 'uniform')

    def _test_save_layer(self, method, status_id, symbols, data=None):

        response = method(
            self.url,
            data=json.dumps(data),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status_id)

        # if it was successful, verify data:
        if status_id in [status.HTTP_201_CREATED, status.HTTP_200_OK]:
            if hasattr(self, 'obj'):
                rec = models.Layer.objects.get(id=self.obj.id)
            else:
                rec = models.Layer.objects.all().order_by('-id',)[0]
            self.assertEqual(rec.title, self.title)
            self.assertEqual(rec.dataset.id, self.dataset.id)
            self.assertEqual(rec.ordering, 2)
            for key in [
                'title', 'strokeWeight', 'rule', 'isShowing',
                'strokeOpacity', 'height', 'width', 'shape', 'strokeColor'
                    ]:
                self.assertEqual(rec.symbols[0][key], symbols[0][key])


class ApiLayerListTest(ViewMixinAPI, ApiLayerTest, test.TestCase):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.metadata = get_metadata()
        self.model = models.Layer
        self.dataset = self.create_dataset()
        self.map = self.create_styled_map(dataset=self.dataset)
        self.url = '/api/0/maps/{0}/layers/'.format(
            self.map.id
        )
        self.urls = [self.url]
        # self.map_id = self.model.styled_map.id
        # self.model = models.Layer
        self.view = views.LayerList.as_view()

    def test_create_layer_using_post(self, **kwargs):
        self._test_save_layer_post(
            status.HTTP_201_CREATED,
            data={
                'title': self.title,
                'dataset': self.dataset.id
            }
        )

    def test_create_view_invalid_request(self, **kwargs):
        self._test_save_layer_post(
            status.HTTP_400_BAD_REQUEST,
            data={
                'dataset': self.dataset.id
            }
        )

        self._test_save_layer_post(
            status.HTTP_400_BAD_REQUEST,
            data={
                'title': self.title,
            }
        )


class ApiLayerInstanceTest(test.TestCase, ViewMixinAPI, ApiLayerTest):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.metadata = get_metadata()
        self.metadata.update({
            'dataset': {'read_only': True, 'required': False, 'type': 'field'},
            'symbols': {'read_only': False, 'required': True, 'type': 'json'},
            'group_by': {
                'read_only': False, 'required': True, 'type': 'string'},
            'metadata': {'read_only': False, 'required': True, 'type': 'json'},
        })
        self.dataset = self.create_dataset()
        self.map = self.create_styled_map(dataset=self.dataset)
        self.obj = self.map.layers[0]
        # self.url = '/api/0/layers/%s/' % self.obj.id
        self.url = '/api/0/maps/{0}/layers/{1}/'.format(
            self.obj.styled_map.id, self.obj.id
        )
        self.map_id = self.map.id
        self.urls = [self.url]
        self.model = models.Layer
        self.view = views.LayerInstance.as_view()

    def test_update_view_using_put(self, **kwargs):
        self._test_save_layer(
            self.client_user.put,
            status.HTTP_200_OK,
            symbols,
            data={
                'title': self.title,
                'ordering': 1,
                'group_by': 'uniform',
                'symbols': json.dumps(symbols),
                'dataset': self.dataset.id,
                'display_field': self.dataset.fields[0].col_name
            }
        )

    def test_update_view_using_patch(self, **kwargs):
        response = self.client_user.patch(
            self.url,
            data=urllib.urlencode({
                'title': self.title,
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rec = models.Layer.objects.get(id=self.obj.id)
        self.assertEqual(rec.title, self.title)
        self.assertNotEqual(self.obj.title, self.title)

    def test_update_view_invalid_json(self, **kwargs):
        self._test_save_layer(
            self.client_user.put,
            status.HTTP_400_BAD_REQUEST,
            'dsadaadasdasdjkjdkasda/ewqeqw/',
            data={
                'title': self.title,
                'ordering': 1,
                'group_by': 'uniform',
                'symbols': json.dumps(symbols),
                'dataset': self.dataset.id,
                'display_field': self.dataset.fields[0].id
            }
        )

    def test_clear_children(self, **kwargs):
        # first add children:
        self._test_save_layer(
            self.client_user.put,
            status.HTTP_200_OK,
            symbols,
            data={
                'title': self.title,
                'ordering': 1,
                'group_by': 'uniform',
                'symbols': json.dumps(symbols),
                'dataset': self.dataset.id,
                'display_field': self.dataset.fields[0].col_name
            }
        )

        # and then get rid of them:
        response = self.client_user.patch(
            self.url,
            data=urllib.urlencode({
                'symbols': []
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rec = models.Layer.objects.get(id=self.obj.id)

    def test_delete_view(self, **kwargs):
        view_id = self.obj.id

        # ensure view exists:
        self.model.objects.get(id=view_id)

        # delete view:
        response = self.client_user.delete(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            self.model.objects.get(id=view_id)
            # throw assertion error if photo still in database
            print 'Object not deleted'
            self.assertEqual(1, 0)
        except self.model.DoesNotExist:
            # trigger assertion success if photo is removed
            self.assertEqual(1, 1)
