from django import test
from localground.apps.site.api import views
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from rest_framework import status


class ApiHomePageTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/']
        self.view = views.api_root

    def test_page_has_required_links(self):
        for url in self.urls:
            response = self.client_user.get(url)
            if response.status_code == status.HTTP_200_OK:
                for item in [
                    'projects', 'photos', 'audio', 'users', 'groups', 'markers', 'snapshots',
                    'tiles', 'prints', 'map-images', 'forms'
                ]:
                    self.assertIn(item, response.content)
    def test_check_metadata(self):
        pass
