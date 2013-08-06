from django import test
from localground.apps.site.api import views
from localground.apps.site.tests import ViewMixin

class ApiMarkerListTest(test.TestCase, ViewMixin):
	
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/markers/']
		self.view = views.MarkerList.as_view()	

class ApiMarkerInstanceTest(test.TestCase, ViewMixin):
	
	def setUp(self):
		ViewMixin.setUp(self)
		self.marker = self.get_marker()
		self.urls = ['/api/0/markers/%s/' % self.marker.id]
		self.view = views.MarkerInstance.as_view()