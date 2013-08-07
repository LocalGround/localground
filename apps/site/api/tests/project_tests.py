from django import test
from localground.apps.site.api import views
from localground.apps.site.tests import ViewMixin

class ApiProjectListTest(test.TestCase, ViewMixin):
	
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/projects/']
		self.view = views.ProjectList.as_view()	