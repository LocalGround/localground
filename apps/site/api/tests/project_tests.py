from django import test
from localground.apps.site.api import views
from localground.apps.site.api.tests.base_tests import ViewMixinAPI

class ApiProjectListTest(test.TestCase, ViewMixinAPI):
	
	def setUp(self):
		ViewMixinAPI.setUp(self)
		self.urls =  ['/api/0/projects/']
		self.view = views.ProjectList.as_view()	