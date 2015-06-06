from django import test
from localground.apps.site.api import views
from localground.apps.site.api.tests.base_tests import ViewMixinAPI

metadata = {
    'east': {'read_only': True, 'required': False, 'type': 'field'},
    'north': {'read_only': True, 'required': False, 'type': 'field'},
    'description': {'read_only': False, 'required': False, 'type': 'memo'},
    'file_name_orig': {'read_only': False, 'required': False, 'type': 'file'},
    'tags': {'read_only': False, 'required': False, 'type': 'string'},
    'url': {'read_only': True, 'required': False, 'type': 'field'},
    'west': {'read_only': True, 'required': False, 'type': 'field'},
    'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
    'zoom': {'read_only': True, 'required': False, 'type': 'field'},
    'source_print': {'read_only': False, 'required': False, 'type': 'field'},
    'overlay_path': {'read_only': True, 'required': False, 'type': 'field'},
    'owner': {'read_only': True, 'required': False, 'type': 'field'},
    'project_id': {'read_only': False, 'required': False, 'type': 'select'},
    'id': {'read_only': True, 'required': False, 'type': 'integer'},
    'south': {'read_only': True, 'required': False, 'type': 'field'},
    'name': {'read_only': False, 'required': False, 'type': 'string'}
}
class ApiScanListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/map-images/']
        self.view = views.ScanList.as_view()
        self.metadata = metadata


class ApiScanDetailTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=True)
        self.scan = self.create_scan(self.user, self.project)
        self.urls = ['/api/0/map-images/%s/' % self.scan.id]
        self.view = views.ScanInstance.as_view()
        self.metadata = metadata
