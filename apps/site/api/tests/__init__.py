# import tests to run within this module
from localground.apps.site.api.tests.association_tests import *
from localground.apps.site.api.tests.form_tests import *
from localground.apps.site.api.tests.homepage_tests import *
from localground.apps.site.api.tests.marker_tests import *
from localground.apps.site.api.tests.print_tests import *
from localground.apps.site.api.tests.project_tests import *
from localground.apps.site.api.tests.photo_tests import *
from localground.apps.site.api.tests.scan_tests import *
from localground.apps.site.api.tests.tile_tests import *


class ApiOverlayTypeListTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/overlay-types/']
		self.view = views.OverlayTypeViewSet.as_view({'get': 'list'})	

class ApiOverlayTypeInstanceTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/overlay-types/1/', '/api/0/overlay-types/2/']
		self.view = views.OverlayTypeViewSet.as_view({'get': 'detail'})
		
class ApiOverlaySourceListTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/overlay-sources/']
		self.view = views.OverlaySourceViewSet.as_view({'get': 'list'})	

class ApiOverlaySourceInstanceTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/overlay-sources/1/', '/api/0/overlay-sources/2/']
		self.view = views.OverlaySourceViewSet.as_view({'get': 'detail'})
		
class ApiDataTypeListTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls =  ['/api/0/data-types/']
		self.view = views.DataTypeViewSet.as_view({'get': 'list'})
		
class ApiDataTypeInstanceTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/data-types/1/', '/api/0/data-types/2/']
		self.view = views.DataTypeViewSet.as_view({'get': 'detail'})
		
	


	

		
