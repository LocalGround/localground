from localground.apps.site.api.tests.base_tests import ViewMixinAPISuperuser, ViewMixinAPI
from django import test
from localground.apps.site.api import views


class ApiOverlaySourceListTest(test.TestCase, ViewMixinAPISuperuser):

    def setUp(self):
        ViewMixinAPISuperuser.setUp(self)
        self.urls = ['/api/0/overlay-sources/']
        self.view = views.OverlaySourceViewSet.as_view({'get': 'list'})


class ApiOverlaySourceInstanceTest(test.TestCase, ViewMixinAPISuperuser):

    def setUp(self):
        ViewMixinAPISuperuser.setUp(self)
        self.urls = ['/api/0/overlay-sources/1/', '/api/0/overlay-sources/2/']
        self.view = views.OverlaySourceViewSet.as_view({'get': 'detail'})


class ApiDataTypeListTest(test.TestCase, ViewMixinAPISuperuser):

    def setUp(self):
        ViewMixinAPISuperuser.setUp(self)
        self.urls = ['/api/0/data-types/']
        self.view = views.DataTypeViewSet.as_view({'get': 'list'})


class ApiDataTypeInstanceTest(test.TestCase, ViewMixinAPISuperuser):

    def setUp(self):
        ViewMixinAPISuperuser.setUp(self)
        self.urls = ['/api/0/data-types/1/', '/api/0/data-types/2/']
        self.view = views.DataTypeViewSet.as_view({'get': 'detail'})


class ApiTileListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/tiles/']
        self.view = views.TileSetList.as_view()
        self.metadata = {
            'id': { 'type': 'integer', 'required': False, 'read_only': True  },
            'url': { 'type': 'field', 'required': False, 'read_only': True  },
            'name': { 'type': 'string', 'required': False, 'read_only': False  },
            'tags': { 'type': 'field', 'required': False, 'read_only': False  },
            'overlay_source': { 'type': 'field', 'required': True, 'read_only': False },
            'base_tile_url': { 'type': 'string', 'required': False, 'read_only': False },
            'base_static_url': { 'type': 'string', 'required': False, 'read_only': False },
            'source_name': { 'type': 'field', 'required': False, 'read_only': True },
            'max_zoom': { 'type': 'integer', 'required': False, 'read_only': False },
            'min_zoom': { 'type': 'integer', 'required': False, 'read_only': False },
            'is_printable': { 'type': 'boolean', 'required': False, 'read_only': False },
            'extras': { 'type': 'json', 'required': False, 'read_only': False },
            'key': { 'type': 'string', 'required': False, 'read_only': False },
            'owner': { 'type': 'field', 'required': False, 'read_only': True },
            'attribution': { 'type': 'string', 'required': False, 'read_only': False }
        }

class ApiTileInstanceTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/tiles/1/', '/api/0/tiles/2/', '/api/0/tiles/3/']
        self.view = views.TileSetInstance.as_view()
        self.metadata = {
            'id': { 'type': 'integer', 'required': False, 'read_only': True  },
            'url': { 'type': 'field', 'required': False, 'read_only': True  },
            'name': { 'type': 'string', 'required': False, 'read_only': False  },
            'tags': { 'type': 'field', 'required': False, 'read_only': False  },
            'overlay_source': { 'type': 'field', 'required': True, 'read_only': False },
            'base_tile_url': { 'type': 'string', 'required': False, 'read_only': False },
            'base_static_url': { 'type': 'string', 'required': False, 'read_only': False },
            'source_name': { 'type': 'field', 'required': False, 'read_only': True },
            'max_zoom': { 'type': 'integer', 'required': False, 'read_only': False },
            'min_zoom': { 'type': 'integer', 'required': False, 'read_only': False },
            'is_printable': { 'type': 'boolean', 'required': False, 'read_only': False },
            'extras': { 'type': 'json', 'required': False, 'read_only': False },
            'key': { 'type': 'string', 'required': False, 'read_only': False },
            'owner': { 'type': 'field', 'required': False, 'read_only': True },
            'attribution': { 'type': 'string', 'required': False, 'read_only': False }
        }
