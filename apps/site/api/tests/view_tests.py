from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib, json
from rest_framework import status

class ApiViewTest(test.TestCase, ViewMixinAPI):
	name = 'New View Name'
	description = 'Test description'
	tags= "a, b, c"
	slug = 'new-friendly-url'
	entities = [
			{ 'overlay_type': 'photo', 'ids': [1, 2, 3] },
			{ 'overlay_type': 'audio', 'ids': [1] },
			{ 'overlay_type': 'marker', 'ids': [1] }
		]
	
	invalid_entities = [
			{ 'overlay_type': 'photo', 'ids': [1000, 2000000, 300] },
			{ 'overlay_type': 'audio', 'ids': [1] },
			{ 'overlay_type': 'marker', 'ids': [1] }
		]
	center = {"type": "Point", "coordinates": [-123.31158757209778, 40.346797604717196]}
	zoom = 10
	basemap = 4
	
	def _test_save_view(self, method, status_id, entities):
		response = method(self.url,
			data=urllib.urlencode({
				'name': self.name,
				'description': self.description,
				'tags': self.tags,
				'slug': self.slug,
				'entities': entities,
				'center': self.center,
				'zoom': self.zoom,
				'basemap': self.basemap,
			}),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status_id)
		
		#if it was successful, verify data: 
		if status_id in [status.HTTP_201_CREATED, status.HTTP_200_OK]:
			if hasattr(self, 'obj'):
				rec = models.View.objects.get(id=self.obj.id)
			else:
				rec = self.model.objects.all().order_by('-id',)[0]
			self.assertEqual(rec.name, self.name)
			self.assertEqual(rec.description, self.description)
			self.assertEqual(rec.tags, self.tags)
			self.assertEqual(rec.slug, self.slug)
			self.assertEqual(3, len(rec.photos))
			self.assertEqual(1, len(rec.audio))
			self.assertEqual(1, len(rec.markers))

class ApiViewListTest(ApiViewTest):
	
	def setUp(self):
		ViewMixinAPI.setUp(self)
		self.url = '/api/0/views/'
		self.urls =  [self.url]
		self.model = models.View
		self.view = views.ViewList.as_view()
		
	def test_create_view_using_post(self, **kwargs):
		self._test_save_view(
					self.client_user.post,
					status.HTTP_201_CREATED,
					json.dumps(self.entities)
				)
		
	def test_create_view_invalid_children(self, **kwargs):
		self._test_save_view(
					self.client_user.post,
					status.HTTP_400_BAD_REQUEST,
					json.dumps(self.invalid_entities)
				)
	def test_create_view_invalid_json(self, **kwargs):
		self._test_save_view(
					self.client_user.post,
					status.HTTP_400_BAD_REQUEST,
					'dsadaadasdasdjkjdkasda/ewqeqw/'
				)
		
class ApiViewInstanceTest(ApiViewTest):
	
	def setUp(self):
		ViewMixinAPI.setUp(self)
		self.obj = self.create_view(self.user, name='Test View 1', authority_id=1)
		self.url = '/api/0/views/%s/' % self.obj.id
		self.urls = [self.url]
		self.model = models.View
		self.view  = views.ViewInstance.as_view()
		
	def test_update_view_using_put(self, **kwargs):
		self._test_save_view(
					self.client_user.put,
					status.HTTP_200_OK,
					json.dumps(self.entities)
				)
		
	def test_update_view_using_patch(self, **kwargs):
		response = self.client_user.patch(self.url,
			data=urllib.urlencode({
				'name': self.name,
			}),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		rec = models.View.objects.get(id=self.obj.id)
		self.assertEqual(rec.name, self.name)
		self.assertNotEqual(self.obj.name, self.name)
	
	def test_update_view_invalid_children_put(self, **kwargs):
		self._test_save_view(self.client_user.put, status.HTTP_400_BAD_REQUEST,
							 json.dumps(self.invalid_entities))
	
	def test_update_view_invalid_children_patch(self, **kwargs):
		self._test_save_view(self.client_user.patch, status.HTTP_400_BAD_REQUEST,
							 json.dumps(self.invalid_entities))
	
	def test_update_view_invalid_json(self, **kwargs):
		self._test_save_view(
					self.client_user.put,
					status.HTTP_400_BAD_REQUEST,
					'dsadaadasdasdjkjdkasda/ewqeqw/'
				)
		
	def test_clear_children(self, **kwargs):
		#first add children:
		self._test_save_view(
					self.client_user.put,
					status.HTTP_200_OK,
					json.dumps(self.entities)
				)
		
		#and then get rid of them:
		response = self.client_user.patch(self.url,
			data=urllib.urlencode({
				'entities': json.dumps([])
			}),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		rec = models.View.objects.get(id=self.obj.id)
		self.assertEqual(0, len(rec.photos))
		self.assertEqual(0, len(rec.audio))
		self.assertEqual(0, len(rec.markers))
			
	def test_delete_view(self, **kwargs):
		view_id = self.obj.id
		
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
			