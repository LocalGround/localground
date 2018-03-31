from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from localground.apps.site.api.fields.list_field import convert_tags_to_list


class ApiLayerTest(object):
    title = 'New Layer Name'
    metadata = {
        'symbols': {'read_only': False, 'required': False, 'type': 'json'},
        'group_by': {'read_only': False, 'required': True, 'type': 'string'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'title': {'read_only': False, 'required': True, 'type': 'string'},
        'data_source': {'read_only': True, 'required': False, 'type': 'field'},
        'metadata': {'read_only': False, 'required': False, 'type': 'json'},
        'map_id': {'read_only': True, 'required': False, 'type': 'field'}
    }

    symbols = [
        {"color": "#7075FF", "width": 30,
            "rule": "worms > 0", "title": "At least 1 worm"},
        {"color": "#F011D9", "width": 30,
            "rule": "worms = 0", "title": "No worms"}
    ]

    def _test_save_layer(
        self, method, status_id, symbols, dataset=None, display_field=None,
            group_by='uniform'):
        d = {
            'title': self.title,
            'ordering': 1,
            'group_by': group_by,
            'symbols': json.dumps(symbols),
            'dataset': dataset,
            'display_field': display_field
        }
        response = method(
            self.url,
            data=json.dumps(d),
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
            self.assertEqual(rec.symbols, self.symbols)
            self.assertEqual(rec.dataset.id, self.form.id)
            self.assertEqual(rec.ordering, 1)


class ApiLayerListTest(ViewMixinAPI, ApiLayerTest, test.TestCase):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.model = models.Layer
        self.form = self.create_form()
        self.map = self.create_styled_map(
            dataset=self.form, layer_title='My Layer')
        self.url = '/api/0/maps/{0}/layers/'.format(
            self.map.id
        )
        self.urls = [self.url]
        # self.map_id = self.model.styled_map.id
        # self.model = models.Layer
        self.view = views.LayerList.as_view()

    def test_create_layer_using_post(self, **kwargs):
        self._test_save_layer(
            self.client_user.post,
            status.HTTP_201_CREATED,
            self.symbols,
            dataset=self.form.id
        )

    def test_create_view_invalid_json(self, **kwargs):
        self._test_save_layer(
            self.client_user.post,
            status.HTTP_400_BAD_REQUEST,
            'dsadaadasdasdjkjdkasda/ewqeqw/',
            dataset=self.form.id
        )


class ApiLayerInstanceTest(test.TestCase, ViewMixinAPI, ApiLayerTest):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.form = self.create_form()
        self.map = self.create_styled_map(
            dataset=self.form, layer_title='My Layer')
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
            self.symbols,
            display_field=self.form.fields[0].id
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
            display_field=self.form.fields[0].id
        )

    def test_clear_children(self, **kwargs):
        # first add children:
        self._test_save_layer(
            self.client_user.put,
            status.HTTP_200_OK,
            self.symbols,
            display_field=self.form.fields[0].id
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
