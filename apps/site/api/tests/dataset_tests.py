from django import test
from localground.apps.site import models
from localground.apps.site.api import views
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from rest_framework import status
import urllib


def get_metadata_dataset():
    return {
        'data_url': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': True, 'type': 'field'},
        'description': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False,
                         'type': 'field'},
        'fields_url': {'read_only': True, 'required': False, 'type': 'field'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'}
    }


class ApiDatasetListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.dataset_1 = self.create_dataset_with_fields()
        self.project_1 = self.create_project()
        self.dataset_2 = self.create_dataset_with_fields(project=self.project_1)
        self.urls = ['/api/0/datasets/']
        self.view = views.DatasetList.as_view()
        self.metadata = get_metadata_dataset()

    def test_page_500_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_user.get(url + '?format=json')
            self.assertEqual(
                response.status_code,
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_user.get(
                url + '?project_id={0}&format=json'.format(self.project.id)
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(len(response.data['results']), 1)


class ApiDatasetInstanceTest(test.TestCase, ViewMixinAPI):
    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.dataset_1 = self.create_dataset_with_fields()
        self.urls = ['/api/0/datasets/{0}/'.format(self.dataset_1.id)]
        self.url = self.urls[0]
        self.view = views.DatasetInstance.as_view()
        self.metadata = get_metadata_dataset()
        self.metadata['project_id']['read_only'] = True

    def test_put_name_description_tags(self, urls=None, **kwargs):
        name = 'my new dataset'
        description = 'new description'
        tags = 'bird, a cat, a dog'
        response = self.client_user.put(
            self.url,
            data=urllib.parse.urlencode({
                'name': name,
                'description': description,
                'tags': tags
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # check that response looks good:
        self.assertEqual(response.data.get('name'), name)
        self.assertEqual(response.data.get('description'), description)
        self.assertEqual(
            response.data.get('tags'), [u'bird', u'a cat', u'a dog'])

        # check that DB commit worked
        dataset = models.Dataset.objects.get(id=self.dataset_1.id)
        self.assertEqual(dataset.name, name)
        self.assertEqual(dataset.description, description)
        self.assertEqual(dataset.tags, [u'bird', u'a cat', u'a dog'])

    def test_patch_name(self, urls=None, **kwargs):
        name = 'my new dataset'
        description = self.dataset_1.description
        tags = self.dataset_1.tags
        response = self.client_user.patch(
            self.url,
            data=urllib.parse.urlencode({
                'name': name
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # check that response looks good:
        self.assertEqual(response.data.get('name'), name)
        self.assertEqual(response.data.get('description'), description)
        self.assertEqual(response.data.get('tags'), tags)

        # check that DB commit worked
        dataset = models.Dataset.objects.get(id=self.dataset_1.id)
        self.assertEqual(dataset.name, name)
        self.assertEqual(dataset.description, description)
        self.assertEqual(dataset.tags, tags)
