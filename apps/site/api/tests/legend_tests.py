from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status


class ApiLegendTest(test.TestCase, ViewMixinAPI):
    name = 'New Legend Name'
    description = 'Test legend description'
    tags = 'a, b, c'
    slug = 'my_legend'
    legend_object = [
        {"color": "#7075FF", "width": 30, "rule": "worms > 0", "title": "At least 1 worm"},
        {"color": "#F011D9", "width": 30, "rule": "worms = 0", "title": "No worms"}
    ]
    invalid_legend_object = [
        {"color": "#7075FF", "width": 30, "rule": "worms > 0", "title": "At least 1 worm"},
        {"color": "#F011D9", "width": 30, "rule": "worms = 0", "title": "No worms"}
    ]

    def _test_save_legend(self, method, status_id, legend_object):
        d = {
            'name': self.name,
            'description': self.description,
            'tags': self.tags,
            'slug': self.slug,
            'legend_object': json.dumps(legend_object)
        }
        # print d
        response = method(self.url,
                          data=urllib.urlencode(d),
                          HTTP_X_CSRFTOKEN=self.csrf_token,
                          content_type="application/x-www-form-urlencoded"
                          )
        #print response.content
        self.assertEqual(response.status_code, status_id)

        # if it was successful, verify data:
        if status_id in [status.HTTP_201_CREATED, status.HTTP_200_OK]:
            if hasattr(self, 'obj'):
                rec = models.Legend.objects.get(id=self.obj.id)
            else:
                rec = self.model.objects.all().order_by('-id',)[0]
            self.assertEqual(rec.name, self.name)
            self.assertEqual(rec.description, self.description)
            self.assertEqual(rec.tags, self.tags)
            self.assertEqual(rec.slug, self.slug)


class ApiLegendListTest(ApiLegendTest):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.url = '/api/0/legends/'
        self.urls = [self.url]
        self.model = models.Legend
        self.view = views.LegendList.as_view()

    def test_create_legend_using_post(self, **kwargs):
        self._test_save_legend(
            self.client_user.post,
            status.HTTP_201_CREATED,
            self.legend_object
        )

    def test_create_view_invalid_json(self, **kwargs):
        self._test_save_legend(
            self.client_user.post,
            status.HTTP_400_BAD_REQUEST,
            'dsadaadasdasdjkjdkasda/ewqeqw/'
        )


class ApiLegendInstanceTest(ApiLegendTest):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.obj = self.create_legend(
            self.user,
            name='Test Legend 1',
            authority_id=1)
        self.url = '/api/0/legends/%s/' % self.obj.id
        self.urls = [self.url]
        self.model = models.Legend
        self.view = views.LegendInstance.as_view()

    def test_update_view_using_put(self, **kwargs):
        self._test_save_legend(
            self.client_user.put,
            status.HTTP_200_OK,
            self.legend_object
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
        rec = models.Legend.objects.get(id=self.obj.id)
        self.assertEqual(rec.name, self.name)
        self.assertNotEqual(self.obj.name, self.name)

    def test_update_view_invalid_children_put(self, **kwargs):
        self._test_save_legend(self.client_user.put, status.HTTP_400_BAD_REQUEST,
                             json.dumps(self.invalid_legend_object))

    def test_update_view_invalid_children_patch(self, **kwargs):
        self._test_save_legend(
            self.client_user.patch,
            status.HTTP_400_BAD_REQUEST,
            json.dumps(
                self.invalid_legend_object))

    def test_update_view_invalid_json(self, **kwargs):
        self._test_save_legend(
            self.client_user.put,
            status.HTTP_400_BAD_REQUEST,
            'dsadaadasdasdjkjdkasda/ewqeqw/'
        )

    def test_clear_children(self, **kwargs):
        # first add children:
        self._test_save_legend(
            self.client_user.put,
            status.HTTP_200_OK,
            self.legend_object
        )

        # and then get rid of them:
        response = self.client_user.patch(self.url,
                                          data=urllib.urlencode({
                                              'legend_object': []
                                          }),
                                          HTTP_X_CSRFTOKEN=self.csrf_token,
                                          content_type="application/x-www-form-urlencoded"
                                          )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rec = models.Legend.objects.get(id=self.obj.id)

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