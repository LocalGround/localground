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
	