from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from localground.apps.site.api.fields.list_field import convert_tags_to_list

class ApiPresentationTest(object):
    name = 'New Presentation'
    description = 'description of presentation'
    tags = "a, b, c"
    slug = 'new-friendly-url'
    metadata = {
        'code': {'read_only': False, 'required': False, 'type': 'json'},
        'caption': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        'slug': {'read_only': False, 'required': True, 'type': 'slug'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'}
    }

    def _test_save_presentation(self, method, status_id, code):
        d = {
            'name': self.name,
            'caption': self.description,
            'tags': self.tags,
            'slug': self.slug,
            'code': json.dumps(code)
        }
        response = method(self.url,
                          data=json.dumps(d),
                          HTTP_X_CSRFTOKEN=self.csrf_token,
                          content_type="application/json"
                          )
        self.assertEqual(response.status_code, status_id)

        # if it was successful, verify data:
        if status_id in [status.HTTP_201_CREATED, status.HTTP_200_OK]:
            if hasattr(self, 'obj'):
                rec = self.model.objects.get(id=self.obj.id)
            else:
                rec = self.model.objects.all().order_by('-id',)[0]
            self.assertEqual(rec.name, self.name)
            self.assertEqual(rec.description, self.description)
            self.assertEqual(rec.tags, convert_tags_to_list(self.tags))
            self.assertEqual(rec.slug, self.slug)
            self.assertEqual(rec.code, code)


class ApiPresentationListTest(test.TestCase, ViewMixinAPI, ApiPresentationTest):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.url = '/api/0/presentations/'
        self.urls = [self.url]
        self.model = models.Presentation
        self.view = views.PresentationList.as_view()

    def test_create_presentation_using_post(self, **kwargs):
        self._test_save_presentation(
            self.client_user.post,
            status.HTTP_201_CREATED,
            {"test": 1}
        )

    def test_create_presentation_using_post_invalid_code(self, **kwargs):
        self._test_save_presentation(
            self.client_user.post,
            status.HTTP_400_BAD_REQUEST,
            'dsadaadasdasdjkjdkasda/ewqeqw/'
        )


class ApiPresentationInstanceTest(test.TestCase, ViewMixinAPI, ApiPresentationTest):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.obj = self.create_presentation(
            self.user,
            name='Test Presentation 1',
            authority_id=1)
        self.url = '/api/0/presentations/%s/' % self.obj.id
        self.urls = [self.url]
        self.model = models.Presentation
        self.view = views.PresentationInstance.as_view()

    def test_update_presentation_using_put(self, **kwargs):
        self._test_save_presentation(
            self.client_user.put,
            status.HTTP_200_OK,
            {'name': 'Berkeley'}
        )

    def test_update_presentation_using_patch(self, **kwargs):
        response = self.client_user.patch(self.url,
                                          data=urllib.urlencode({
                                              'name': self.name,
                                          }),
                                          HTTP_X_CSRFTOKEN=self.csrf_token,
                                          content_type="application/x-www-form-urlencoded"
                                          )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rec = self.model.objects.get(id=self.obj.id)
        self.assertEqual(rec.name, self.name)
        self.assertNotEqual(self.obj.name, self.name)

    def test_update_presentation_invalid_json_put(self, **kwargs):
        self._test_save_presentation(
            self.client_user.put,
            status.HTTP_400_BAD_REQUEST,
            'dsadaadasdasdjkjdkasda/ewqeqw/'
        )

    def test_update_presentation_invalid_json_patch(self, **kwargs):
        self._test_save_presentation(
            self.client_user.patch,
            status.HTTP_400_BAD_REQUEST,
            'dsadaadasdasdjkjdkasda/ewqeqw/'
        )

    def test_clear_code(self, **kwargs):
        # first add children:
        self._test_save_presentation(
            self.client_user.put,
            status.HTTP_200_OK,
            [{"a": "This is a test"}]
        )

        # and then get rid of them:
        response = self.client_user.patch(self.url,
                                          data=urllib.urlencode({'entities': json.dumps([])}),
                                          HTTP_X_CSRFTOKEN=self.csrf_token,
                                          content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rec = self.model.objects.get(id=self.obj.id)

    def test_delete_presentation(self, **kwargs):
        presentation_id = self.obj.id

        # ensure prez exists:
        self.model.objects.get(id=presentation_id)

        # delete prez:
        response = self.client_user.delete(self.url,
                                           HTTP_X_CSRFTOKEN=self.csrf_token
                                           )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            self.model.objects.get(id=presentation_id)
            # throw assertion error if photo still in database
            print 'Object not deleted'
            self.assertEqual(1, 0)
        except self.model.DoesNotExist:
            # trigger assertion success if photo is removed
            self.assertEqual(1, 1)
