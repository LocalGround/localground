from django import test
from localground.apps.site.api import views
from localground.apps.site.tests import ViewMixin

class ApiLayoutListTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/layouts/']
		self.view = views.LayoutViewSet.as_view({'get': 'list'})	

class ApiLayoutInstanceTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/layouts/1/', '/api/0/layouts/3/', '/api/0/layouts/4/']
		self.view = views.LayoutViewSet.as_view({'get': 'detail'})
		
class ApiPrintListTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/prints/']
		self.view = views.PrintViewSet.as_view({'get': 'list'})	

'''
class ApiPrintInstanceTest(test.TestCase, ViewMixin):
	# Todo:  need to create a print before I test it.
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/prints/1/', '/api/0/prints/2/']
		self.view = views.PrintViewSet.as_view({'get': 'detail'})
'''