from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib, json
from rest_framework import status

class ApiViewListTest(test.TestCase, ViewMixinAPI):
	
	def setUp(self):
		ViewMixinAPI.setUp(self)
		self.url = '/api/0/views/'
		self.urls =  [self.url]
		self.model = models.View
		self.view = views.ViewList.as_view()
		
	def test_create_view_using_post(self, **kwargs):
		name = 'New View!'
		description = 'New view description'
		tags= "d, e, f"
		slug = 'new-view-123'
		entities = [
			{ 'overlay_type': 'photo', 'id': 1 },
			{ 'overlay_type': 'photo', 'id': 2 },
			{ 'overlay_type': 'photo', 'id': 3 },
			{ 'overlay_type': 'audio', 'id': 1 },
			{ 'overlay_type': 'marker', 'id': 1 }
		]
		response = self.client_user.post(self.url,
			data=urllib.urlencode({
				'name': name,
				'description': description,
				'tags': tags,
				'slug': slug,
				'entities': json.dumps(entities)
			}),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		new_obj = self.model.objects.all().order_by('-id',)[0]
		self.assertEqual(new_obj.name, name)
		self.assertEqual(new_obj.description, description)
		self.assertEqual(new_obj.tags, tags)
		self.assertEqual(new_obj.slug, slug)
		self.assertEqual(3, len(new_obj.photos))
		self.assertEqual(1, len(new_obj.audio))
		self.assertEqual(1, len(new_obj.markers))
		
class ApiViewInstanceTest(test.TestCase, ViewMixinAPI):
	
	def setUp(self):
		ViewMixinAPI.setUp(self)
		self.viewObj = self.create_view(self.user, name='Test View 1', authority_id=1)
		self.url = '/api/0/views/%s/' % self.viewObj.id
		self.urls = [self.url]
		self.model = models.View
		self.view = views.ViewInstance.as_view()
		
	def test_update_view_using_put(self, **kwargs):
		name = 'New View Name'
		description = 'Test description'
		tags= "a, b, c"
		slug = 'new-friendly-url'
		entities = [
			{ 'overlay_type': 'photo', 'id': 1 },
			{ 'overlay_type': 'audio', 'id': 1 }
		]
		
		response = self.client_user.put(self.url,
			data=urllib.urlencode({
				'name': name,
				'description': description,
				'tags': tags,
				'slug': slug,
				'entities': json.dumps(entities)
			}),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		updated_obj = models.View.objects.get(id=self.viewObj.id)
		self.assertEqual(updated_obj.name, name)
		self.assertEqual(updated_obj.description, description)
		self.assertEqual(updated_obj.tags, tags)
		self.assertEqual(updated_obj.slug, slug)
		self.assertEqual(len(updated_obj.entities.all()), 2)
			
	def test_delete_view(self, **kwargs):
		view_id = self.viewObj.id
		
		# ensure view exists:
		self.model.objects.get(id=view_id)
		
		#delete view:
		response = self.client_user.delete(self.url,
			HTTP_X_CSRFTOKEN=self.csrf_token
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		
		# check to make sure it's gone:
		try:
			self.model.objects.get(id=view_id)
			#throw assertion error if photo still in database
			print 'Object not deleted'
			self.assertEqual(1, 0)
		except self.model.DoesNotExist:
			#trigger assertion success if photo is removed
			self.assertEqual(1, 1)
			