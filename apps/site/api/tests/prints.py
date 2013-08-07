from django import test
from localground.apps.site import models
from localground.apps.site.api import views
from localground.apps.site.tests import ViewMixin
import urllib
from rest_framework import status

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
			
	def test_create_print_using_post(self, **kwargs):
		lat, lng = 54.16, 60.4
		map_title = 'A Map Title'
		instructions = 'Some nstructions.'
		layout = 1
		map_provider = 1
		zoom = 17
		
		response = self.client.post(self.url,
			data=urllib.urlencode({
				'lat': lat,
				'lng': lng,
				'map_title': map_title,
				'instructions': instructions,
				'layout': layout,
				'map_provider': map_provider,
				'zoom': zoom,
				'project_id': self.project.id
			}),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		new_object = (models.Print.objects
						.select_related('layout', 'map_provider')
						.all()
						.order_by('-id',))[0]
		self.assertEqual(new_object.name, map_title)
		self.assertEqual(new_object.description, instructions)
		self.assertEqual(new_object.center.y, lat)
		self.assertEqual(new_object.center.x, lng)
		self.assertEqual(new_object.project.id, self.project.id)
		self.assertEqual(new_object.layout.id, layout)
		self.assertEqual(new_object.map_provider.id, layout)


'''
class ApiPrintInstanceTest(test.TestCase, ViewMixin):
	# Todo:  need to create a print before I test it.
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/prints/1/', '/api/0/prints/2/']
		self.view = views.PrintViewSet.as_view({'get': 'detail'})
'''