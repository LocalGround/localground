from django import test
from localground.apps.site import models
from localground.apps.site.api import views
from localground.apps.site.tests import ViewMixin
import urllib

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
		self.url = '/api/0/prints/'
		self.urls =  [self.url]
		self.view = views.PrintList.as_view()
		
	'''	
	def test_create_print_using_post(self, **kwargs):
		lat, lng, name, description, color = 54.16, 60.4, 'New Marker 1', \
							'Test description1', 'FF0000'
		response = self.client.post(self.url,
			data=urllib.urlencode({
				'lat': lat,
				'lng': lng,
				'name': name,
				'description': description,
				'color': color,
				'project_id': self.project.id
			}),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		new_object = models.Print.objects.all().order_by('-id',)[0]
		self.assertEqual(new_object.name, name)
		self.assertEqual(new_object.description, description)
		self.assertEqual(new_object.center.y, lat)
		self.assertEqual(new_object.center.x, lng)
		self.assertEqual(new_object.project.id, self.project.id)
	'''

'''
class ApiPrintInstanceTest(test.TestCase, ViewMixin):
	# Todo:  need to create a print before I test it.
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/prints/1/', '/api/0/prints/2/']
		self.view = views.PrintViewSet.as_view({'get': 'detail'})
'''