from django import test
from localground.apps.site.api import views
from localground.apps.site.tests import ViewMixin

class ApiTileListTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/tiles/']
		self.view = views.TileViewSet.as_view({'get': 'list'})	

class ApiTileInstanceTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/tiles/1/', '/api/0/tiles/2/', '/api/0/tiles/3/']
		self.view = views.TileViewSet.as_view({'get': 'detail'})
	
class ApiOverlayTypeListTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/overlaytypes/']
		self.view = views.OverlayTypeViewSet.as_view({'get': 'list'})	

class ApiOverlayTypeInstanceTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/overlaytypes/1/', '/api/0/overlaytypes/2/']
		self.view = views.OverlayTypeViewSet.as_view({'get': 'detail'})
		
class ApiOverlaySourceListTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/overlaysources/']
		self.view = views.OverlaySourceViewSet.as_view({'get': 'list'})	

class ApiOverlaySourceInstanceTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/overlaysources/1/', '/api/0/overlaysources/2/']
		self.view = views.OverlaySourceViewSet.as_view({'get': 'detail'})
