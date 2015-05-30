from django import test
from localground.apps.site.api import views
from localground.apps.site.api.tests.base_tests import ViewMixinAPI


class ApiScanListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/map-images/']
        self.view = views.ScanList.as_view()


class ApiScanDetailTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=True)
        self.scan = self.create_scan(self.user, self.project)
        self.urls = ['/api/0/map-images/%s/' % self.scan.id]
        self.view = views.ScanInstance.as_view()
