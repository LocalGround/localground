from django import test
from localground.apps.site.api import views
from localground.apps.site.tests import ViewMixin

class ApiFormListTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/forms/']
		self.view = views.FormList.as_view()	

'''
class ApiFormInstanceTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/forms/1/', '/api/0/forms/2/', '/api/0/forms/3/']
		self.view = views.FormInstance.as_view()
'''