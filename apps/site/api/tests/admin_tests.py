from localground.apps.site.api.tests.base_tests import ViewMixinAPISuperuser
from django import test
from localground.apps.site.api import views


class ApiOverlayTypeListTest(test.TestCase, ViewMixinAPISuperuser):

    def setUp(self):
        ViewMixinAPISuperuser.setUp(self)
        self.urls = ['/api/0/overlay-types/']
        self.view = views.OverlayTypeViewSet.as_view({'get': 'list'})


class ApiOverlayTypeInstanceTest(test.TestCase, ViewMixinAPISuperuser):

    def setUp(self):
        ViewMixinAPISuperuser.setUp(self)
        self.urls = ['/api/0/overlay-types/1/', '/api/0/overlay-types/2/']
        self.view = views.OverlayTypeViewSet.as_view({'get': 'detail'})


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


class ApiTileListTest(test.TestCase, ViewMixinAPISuperuser):

    def setUp(self):
        ViewMixinAPISuperuser.setUp(self)
        self.urls = ['/api/0/tiles/']
        self.view = views.TileViewSet.as_view({'get': 'list'})


class ApiTileInstanceTest(test.TestCase, ViewMixinAPISuperuser):

    def setUp(self):
        ViewMixinAPISuperuser.setUp(self)
        self.urls = ['/api/0/tiles/1/', '/api/0/tiles/2/', '/api/0/tiles/3/']
        self.view = views.TileViewSet.as_view({'get': 'detail'})
