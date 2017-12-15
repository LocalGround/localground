from django import test
from localground.apps.site import models
from localground.apps.site.api import views
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from rest_framework import status


def get_metadata_form():
    return {
        'data_url': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': True, 'type': 'field'},
        'caption': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False,
                         'type': 'field'},
        'fields_url': {'read_only': True, 'required': False, 'type': 'field'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'}
    }


class ApiFormListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.form_1 = self.create_form_with_fields()
        self.project_1 = self.create_project()
        self.form_2 = self.create_form_with_fields(project=self.project_1)
        self.urls = ['/api/0/forms/']
        self.view = views.FormList.as_view()
        self.metadata = get_metadata_form()

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
