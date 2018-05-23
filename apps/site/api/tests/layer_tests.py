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


class ApiLayerListTest(ViewMixinAPI, test.TestCase):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.metadata = get_metadata()
        self.model = models.Layer
        self.dataset = self.create_dataset()
        self.map = self.create_styled_map(dataset=self.dataset)
        self.url = '/api/0/maps/{0}/layers/'.format(
            self.map.id
        )
        self.title = 'My Layer'
        self.urls = [self.url]
        # self.map_id = self.model.styled_map.id
        # self.model = models.Layer
        self.view = views.LayerList.as_view()

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
            self.assertEqual(len(results['symbols']), 1)
            self.assertEqual(
                results['symbols'][0]['title'], 'Untitled Symbol')

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


class ApiLayerInstanceTest(ViewMixinAPI, test.TestCase):

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
        self.title = 'My Layer'
        self.map_id = self.map.id
        self.urls = [self.url]
        self.model = models.Layer
        self.view = views.LayerInstance.as_view()

    def _test_save_layer(self, method, data):

        response = method(
            self.url,
            data=json.dumps(data),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )

        # if it was successful, verify symbols:
        if response.status_code == status.HTTP_200_OK:
            for key in [
                'title', 'strokeWeight', 'rule', 'isShowing',
                'strokeOpacity', 'height', 'width', 'shape', 'strokeColor'
                    ]:
                self.assertEqual(
                    response.data['symbols'][0][key], symbols[0][key])
        return response

    def test_update_view_using_put(self, **kwargs):
        response = self._test_save_layer(
            self.client_user.put,
            data={
                'title': self.title,
                'ordering': 1,
                'metadata': json.dumps(models.Layer.default_metadata),
                'group_by': 'uniform',
                'symbols': json.dumps(symbols),
                'dataset': self.dataset.id,
                'display_field': self.dataset.fields[0].col_name
            }
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rec = models.Layer.objects.get(id=self.obj.id)
        self.assertEqual(rec.title, self.title)
        self.assertEqual(rec.dataset.id, self.dataset.id)
        self.assertEqual(rec.ordering, 1)
        self.assertEqual(rec.group_by, 'uniform')
        self.assertEqual(rec.symbols, symbols)
        self.assertEqual(rec.dataset, self.dataset)
        self.assertEqual(rec.display_field, self.dataset.fields[0])
        self.assertEqual(rec.metadata['isShowing'], True)

    def test_update_view_using_patch(self, **kwargs):
        response = self.client_user.patch(
            self.url,
            data=urllib.urlencode({
                'title': 'My new title',
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rec = models.Layer.objects.get(id=self.obj.id)
        self.assertEqual(rec.title, 'My new title')
        self.assertEqual(response.data['title'], 'My new title')

    def test_update_view_invalid_json(self, **kwargs):
        response = self._test_save_layer(
            self.client_user.put,
            'dsadaadasdasdjkjdkasda/ewqeqw/'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_clear_children(self, **kwargs):
        # first add children:
        response = self._test_save_layer(
            self.client_user.put,
            data={
                'title': self.title,
                'ordering': 2,
                'metadata': json.dumps(models.Layer.default_metadata),
                'group_by': 'uniform',
                'symbols': json.dumps(symbols),
                'dataset': self.dataset.id,
                'display_field': self.dataset.fields[0].col_name
            }
        )
        rec = models.Layer.objects.get(id=self.obj.id)
        self.assertEqual(rec.title, self.title)
        self.assertEqual(rec.ordering, 2)
        self.assertEqual(rec.symbols, symbols)
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
        self.assertEqual(rec.symbols, [])

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

    def test_update_invalid_display_field_throws_error(self, **kwargs):
        response = self.client_user.patch(
            self.url,
            data=json.dumps({
                'display_field': 'weeeeee'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data[0], u'The field "weeeeee" could not be found.')

    def test_symbol_rules_reference_valid_field_keys(self, **kwargs):
        response = self.client_user.patch(
            self.url,
            data=json.dumps({
                'display_field': 'weeeeee'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data[0], u'The field "weeeeee" could not be found.')

    def test_symbol_rules_get_converted_to_field_notation_in_database(self):
        f = self.create_field(
                self.dataset, name='Worm Count',
                data_type=models.DataType.objects.get(id=2),
                ordering=5)
        self.assertEqual(f.col_name, 'worm_count')
        self.assertEqual(f.col_name_db, 'field_{0}'.format(f.id))
        symbol = models.Symbol.SIMPLE.to_dict()
        rule = '{0} > 3 and {0} < 6 and {1} = \'larry rules!\''.format(
            f.col_name, self.dataset.fields[0].col_name
        )
        symbol['rule'] = rule
        response = self.client_user.patch(
            self.url,
            data=json.dumps({
                'symbols': [symbol]
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('symbols')[0]['rule'], rule)
        layer = models.Layer.objects.get(id=self.obj.id)
        self.assertEqual(
            layer.symbols[0]['rule'],
            '{0} > 3 and {0} < 6 and {1} = \'larry rules!\''.format(
                f.col_name_db, self.dataset.fields[0].col_name_db
            ))

    def toggle_layer_show_hide(self):
        self.assertEqual(self.obj.metadata['isShowing'], True)
        metadata = models.Layer.default_metadata
        metadata['isShowing'] = False
        response = self.client_user.patch(
            self.url,
            data=json.dumps({
                'metadata': metadata
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('metadata')['isShowing'], False)
        layer = models.Layer.objects.get(id=self.obj.id)
        self.assertEqual(layer.metadata['isShowing'], False)

    def test_changing_field_name_doesnt_wreck_rules(self):
        f = self.create_field(
                self.dataset, name='Worm Count',
                data_type=models.DataType.objects.get(id=2),
                ordering=5)
        symbol = models.Symbol.SIMPLE.to_dict()
        rule = '{0} > 3 and {0} < 6 and {1} = larry'.format(
            f.col_name, self.dataset.fields[0].col_name
        )
        symbol['rule'] = rule
        response = self.client_user.patch(
            self.url,
            data=json.dumps({
                'symbols': [symbol]
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        layer = models.Layer.objects.get(id=self.obj.id)
        self.assertEqual(
            layer.symbols[0]['rule'],
            '{0} > 3 and {0} < 6 and {1} = larry'.format(
                f.col_name_db, self.dataset.fields[0].col_name_db
            ))

        f.col_alias = 'Worm 1 Count'
        f.save()
        response = self.client_user.get(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(
            response.data.get('symbols')[0]['rule'],
            'worm_1_count > 3 and worm_1_count < 6 and name = larry'
        )

    def test_field_names_or_values_can_contain_and_or(self):
        symbol = models.Symbol.SIMPLE.to_dict()
        for rule in [
                'name = Oregon',
                "name = oregon and name = 'and'",
                ]:
            symbol['rule'] = rule
            response = self.client_user.patch(
                self.url,
                data=json.dumps({
                    'symbols': [symbol]
                }),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/json"
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertTrue(isinstance(response.data['symbols'], list))

    def test_bad_symbol_rules_rejected(self):
        f = self.create_field(
                self.dataset, name='Worm Count',
                data_type=models.DataType.objects.get(id=2),
                ordering=5)
        self.assertEqual(f.col_name, 'worm_count')
        self.assertEqual(f.col_name_db, 'field_{0}'.format(f.id))
        symbol = models.Symbol.SIMPLE.to_dict()
        for rule in [
                '{0} > 3 and {0} < 6 and name = larry'.format('blah'),
                'name =',
                'state = Oregon',  # invalid column name
                'state = oregon and name = and',  # invalid column name
                'dasjdad das dadad dasd',
                'worm_count = 5 and x =',
                'worm_count > 5 and1 worm_count < 10'
                ]:
            symbol['rule'] = rule
            # print rule
            response = self.client_user.patch(
                self.url,
                data=json.dumps({
                    'symbols': [symbol]
                }),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/json"
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertTrue(isinstance(response.data['symbols'], list))
