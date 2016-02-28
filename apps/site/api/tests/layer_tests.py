from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from localground.apps.site.api.fields.list_field import convert_tags_to_list

class ApiLayerTest(object):
    name = 'New Layer Name'
    description = 'Test layer description'
    tags = "a,b,c"
    slug = 'my_layer'
    metadata = {
        'symbols': {'read_only': False, 'required': False, 'type': 'json'},
        'caption': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        'slug': {'read_only': False, 'required': True, 'type': 'slug'},
        'access': {'read_only': True, 'required': False, 'type': 'field'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'}
    }
    symbols = [
        {"color": "#7075FF", "width": 30, "rule": "worms > 0", "title": "At least 1 worm"},
        {"color": "#F011D9", "width": 30, "rule": "worms = 0", "title": "No worms"}
    ]
    invalid_symbols = [
        {"color": "#7075FF", "width": 30, "rule": "worms > 0", "title": "At least 1 worm"},
        {"color": "#F011D9", "width": 30, "rule": "worms = 0", "title": "No worms"}
    ]

    def _test_save_layer(self, method, status_id, symbols):
        d = {
            'name': self.name,
            'caption': self.description,
            'tags': self.tags,
            'slug': self.slug,
            'symbols': json.dumps(symbols)
        }
        #print d
        #response = method(self.url,data=urllib.urlencode(d),HTTP_X_CSRFTOKEN=self.csrf_token,content_type="application/x-www-form-urlencoded")
        response = method(self.url,data=json.dumps(d),HTTP_X_CSRFTOKEN=self.csrf_token,content_type="application/json")
        #print response.data
        self.assertEqual(response.status_code, status_id)

        # if it was successful, verify data:
        if status_id in [status.HTTP_201_CREATED, status.HTTP_200_OK]:
            if hasattr(self, 'obj'):
                rec = models.Layer.objects.get(id=self.obj.id)
            else:
                rec = self.model.objects.all().order_by('-id',)[0]
            self.assertEqual(rec.name, self.name)
            self.assertEqual(rec.description, self.description)
            self.assertEqual(rec.tags, convert_tags_to_list(self.tags))
            self.assertEqual(rec.slug, self.slug)


class ApiLayerListTest(test.TestCase, ViewMixinAPI, ApiLayerTest):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.url = '/api/0/layers/'
        self.urls = [self.url]
        self.model = models.Layer
        self.view = views.LayerList.as_view()

    def test_create_layer_using_post(self, **kwargs):
        self._test_save_layer(
            self.client_user.post,
            status.HTTP_201_CREATED,
            self.symbols
        )

    def test_create_view_invalid_json(self, **kwargs):
        self._test_save_layer(
            self.client_user.post,
            status.HTTP_400_BAD_REQUEST,
            'dsadaadasdasdjkjdkasda/ewqeqw/'
        )


class ApiLayerInstanceTest(test.TestCase, ViewMixinAPI, ApiLayerTest):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.obj = self.create_layer(
            self.user,
            name='Test Layer 1',
            authority_id=1)
        self.url = '/api/0/layers/%s/' % self.obj.id
        self.urls = [self.url]
        self.model = models.Layer
        self.view = views.LayerInstance.as_view()

    def test_update_view_using_put(self, **kwargs):
        self._test_save_layer(
            self.client_user.put,
            status.HTTP_200_OK,
            self.symbols
        )

    def test_update_view_using_patch(self, **kwargs):
        response = self.client_user.patch(self.url,
                                          data=urllib.urlencode({
                                              'name': self.name,
                                          }),
                                          HTTP_X_CSRFTOKEN=self.csrf_token,
                                          content_type="application/x-www-form-urlencoded"
                                          )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rec = models.Layer.objects.get(id=self.obj.id)
        self.assertEqual(rec.name, self.name)
        self.assertNotEqual(self.obj.name, self.name)

    def test_update_view_invalid_children_put(self, **kwargs):
        self._test_save_layer(self.client_user.put, status.HTTP_400_BAD_REQUEST,
                             json.dumps(self.invalid_symbols))

    def test_update_view_invalid_children_patch(self, **kwargs):
        self._test_save_layer(
            self.client_user.patch,
            status.HTTP_400_BAD_REQUEST,
            json.dumps(self.invalid_symbols))

    def test_update_view_invalid_json(self, **kwargs):
        self._test_save_layer(
            self.client_user.put,
            status.HTTP_400_BAD_REQUEST,
            'dsadaadasdasdjkjdkasda/ewqeqw/'
        )

    def test_clear_children(self, **kwargs):
        # first add children:
        self._test_save_layer(
            self.client_user.put,
            status.HTTP_200_OK,
            self.symbols
        )

        # and then get rid of them:
        response = self.client_user.patch(self.url,
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
        response = self.client_user.delete(self.url,
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