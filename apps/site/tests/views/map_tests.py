from django import test
from localground.apps.site.views import maps
from localground.apps.site.tests import ViewMixin, ViewAnonymousMixin
from rest_framework import status

class MapEditorTest(test.TestCase, ViewMixin):

    def setUp(self):
        ViewMixin.setUp(self)
        self.urls = ['/maps/edit/new/']
        self.view = maps.show_map_editor_new

class PublicMapViewTest(test.TestCase, ViewAnonymousMixin):

    def setUp(self):
        ViewAnonymousMixin.setUp(self)
        self.snapshot1 = self.create_snapshot(self.user)
        self.snapshot2 = self.create_snapshot(self.user)
        self.urls = [
            '/maps/embed/{0}/'.format(self.snapshot1.slug),
            '/maps/embed/{0}/'.format(self.snapshot2.slug)
        ]
        self.view = maps.show_map_viewer_embedded
        
    def test_bad_slug_raises_404(self, urls=None):
        for url in ['/maps/embed/', '/maps/embed/123']:
            response = self.client_anonymous.get(url)
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_good_slug_returns_200(self, urls=None):
        for url in self.urls:
            response = self.client_anonymous.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        
