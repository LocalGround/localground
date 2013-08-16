from django import test
from localground.apps.site.api import views
from localground.apps.site.tests import ViewMixin

class ApiScanListTest(test.TestCase, ViewMixin):
	
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/map-images/']
		self.view = views.ScanViewSet.as_view({'get': 'list'})
		
class ApiScanDetailTest(test.TestCase, ViewMixin):
	
	def setUp(self):
		ViewMixin.setUp(self)
		self.scan = self.create_scan(self.user, self.project)
		self.urls =  ['/api/0/map-images/%s/' % self.scan.id]
		self.view = views.ScanViewSet.as_view({'get': 'detail'})