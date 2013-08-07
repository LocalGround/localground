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



class ApiPrintInstanceTest(test.TestCase, ViewMixin):
	def create_print(self):
		from django.contrib.gis.geos import Point
		p = models.Print.generate_print(
			self.user,
			self.project,
			models.Layout.objects.get(id=1),
			models.WMSOverlay.objects.get(id=1),
			17,
			Point(61.4, 55, srid=4326),
			'http://localground.stage',
			map_title='A title',
			instructions='A description',
			form=None,
			layer_ids=None,
			scan_ids=None,
			has_extra_form_page=False,
			do_save=True
		)
		return p
	
	def setUp(self):
		ViewMixin.setUp(self)
		self.print_object = self.create_print()
		self.url = '/api/0/prints/%s/' % self.print_object.id
		self.urls = [self.url]
		self.view = views.PrintInstance.as_view()
		self.model = models.Print
		
	
	def test_update_print_using_patch(self, **kwargs):
		name, description, tags = 'A', 'B', 'C'
		response = self.client.patch(self.url,
			data=urllib.urlencode({
				'map_title': name,
				'instructions': description,
				'tags': tags
			}),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		updated_obj = self.model.objects.get(id=self.print_object.id)
		self.assertEqual(updated_obj.name, name)
		self.assertEqual(updated_obj.description, description)
		self.assertEqual(updated_obj.tags, tags)
		
	def test_update_print_using_put(self, **kwargs):
		name, description, tags = 'A', 'B', 'C'
		response = self.client.put(self.url,
			data=urllib.urlencode({
				'map_title': name,
				'instructions': description,
				'tags': tags
			}),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		updated_obj = self.model.objects.get(id=self.print_object.id)
		self.assertEqual(updated_obj.name, name)
		self.assertEqual(updated_obj.description, description)
		self.assertEqual(updated_obj.tags, tags)
		
	def test_delete_print(self, **kwargs):
		print_id = self.print_object.id
		
		# ensure photo exists:
		self.model.objects.get(id=print_id)
		
		#delete photo:
		response = self.client.delete(self.url,
			HTTP_X_CSRFTOKEN=self.csrf_token
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		
		# check to make sure it's gone:
		try:
			self.model.objects.get(id=print_id)
			#throw assertion error if print still in database
			print 'Print not deleted'
			self.assertEqual(1, 0)
		except self.model.DoesNotExist:
			#trigger assertion success if print is removed
			self.assertEqual(1, 1)
		
		
