from django.core.urlresolvers import resolve
from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from django.test.client import RequestFactory
from django.contrib.auth.models import User
from django.middleware import csrf

class Client(test.Client):
	'''
	Extended Client to support PATCH method based on this code discussion:
	https://code.djangoproject.com/ticket/17797
	'''
	def patch(self, path, data='', content_type='application/octet-stream',
			follow=False, **extra):
		"""
		Send a resource to the server using PATCH.
		"""
		response = self.generic('PATCH', path, data=data,
								content_type=content_type, **extra)
		if follow:
			response = self._handle_redirects(response, **extra)
		return response


class APIDataMixin(object):
	user_password = 'top_secret'
	
	def get_csrf_token(self):
		c = test.Client()
		response = c.get('/accounts/login/')
		return unicode(response.context['csrf_token'])
	
	def create_user(self):
		return User.objects.create_user('tester',
			first_name='test', email='', password=self.user_password
		)
	def get_user(self, user_id=2):
		return User.objects.get(id=user_id)

	def create_project(self, user):
		p = models.Project(
			name='Test Project',
			owner=user,
			last_updated_by=user,
			access_authority=models.ObjectAuthority.objects.get(id=1)
		)
		p.save()
		return p
	
	def get_project(self, project_id=1):
		return models.Project.objects.get(id=project_id)
	
	def create_marker(self, user, project):
		from django.contrib.gis.geos import Point
		#create a marker:
		lat = 37.8705
		lng = -122.2819
		m = models.Marker(
			project=project,
			owner=user,
			color='CCCCCC',
			last_updated_by=user,
			point=Point(lng, lat, srid=4326)
		)
		m.save()
		return m
	
	def get_marker(self, marker_id=1):
		return models.Marker.objects.get(id=marker_id)

class APITestMixin(APIDataMixin):
	fixtures = ['initial_data.json', 'test_data.json']
	
	def setUp(self):
		self.user = self.get_user()
		self.project = self.get_project()
		self.csrf_token = self.get_csrf_token()
		self.factory = RequestFactory()
		self.client = self._get_client()
		
	def _get_client(self):
		c = Client(enforce_csrf_checks=True)
		c.login(username='tester', password=self.user_password)
		c.cookies['csrftoken'] = self.csrf_token
		return c
	
	def test_page_403_status_anonymous_user(self):
		c = Client() #don't use credentialed client
		for url in self.urls:
			response = c.get(url)
			self.assertEqual(response.status_code, 403)
	
	def test_page_200_status_basic_user(self, **kwargs):
		for url in self.urls:
			response = self.client.get(url)
			self.assertEqual(response.status_code, 200)
			
		
	def test_page_resolves_to_view(self):
		for url in self.urls:
			func = resolve(url).func
			func_name = '{}.{}'.format(func.__module__, func.__name__)
			view_name = '{}.{}'.format(self.view.__module__, self.view.__name__)
			#print func_name, view_name
			self.assertEqual(func_name, view_name)
	
class ApiHomePageTest(test.TestCase, APITestMixin):
	def setUp(self):
		APITestMixin.setUp(self)
		self.urls = ['/api/0/']
		self.view = views.api_root
	
	def test_page_has_required_links(self):
		for url in self.urls:
			response = self.client.get(url)
			if response.status_code == 200:
				for item in [
					'projects', 'photos', 'audio', 'users', 'groups', 'markers'
				]: self.assertIn(item, response.content)


class ApiProjectListTest(test.TestCase, APITestMixin):
	
	def setUp(self):
		APITestMixin.setUp(self)
		self.urls =  ['/api/0/projects/']
		self.view = views.ProjectList.as_view()
		

class ApiMarkerListTest(test.TestCase, APITestMixin):
	
	def setUp(self):
		APITestMixin.setUp(self)
		self.urls =  ['/api/0/markers/']
		self.view = views.MarkerList.as_view()
		

class ApiMarkerInstanceTest(test.TestCase, APITestMixin):
	
	def setUp(self):
		APITestMixin.setUp(self)
		self.marker = self.get_marker()
		self.urls = ['/api/0/markers/%s/' % self.marker.id]
		self.view = views.MarkerInstance.as_view()
	
	
class ApiRelatedMediaListTest(test.TestCase, APITestMixin):
	def setUp(self):
		APITestMixin.setUp(self)
		self.marker = self.get_marker()
		url = '/api/0/markers/%s/%s/'
		self.urls = [
			url % (self.marker.id, 'photos'),
			url % (self.marker.id, 'audio')
			#url % (self.marker.id, 'map-images')
		]
		self.view = views.RelatedMediaList.as_view()
		
	def create_relation(self, entity_type, id=1, ordering=1):
		r = models.EntityGroupAssociation(
			entity_type=entity_type,
			entity_id=id,
			group_type=models.Marker.get_content_type(),
			group_id=self.marker.id,
			ordering=ordering,
			owner=self.user,
			last_updated_by=self.user
		)
		r.save()
		return r
	
	def test_page_404_if_invalid_marker_id(self, **kwargs):
		url = '/api/0/markers/%s/%s/'
		urls = [
			url % (999, 'photos'),
			url % (999, 'audio')
		]
		for url in urls:
			response = self.client.get(url)
			self.assertEqual(response.status_code, 404)
			
			
	def test_attach_media_to_marker(self, **kwargs):
		group_type = models.Marker.get_content_type()
		for i, url in enumerate(self.urls):
			entity_type = models.Base.get_model(
					model_name_plural=url.split('/')[-2]
				).get_content_type()
			
			# 1) make sure that no objects are appended to the marker:
			queryset = models.EntityGroupAssociation.objects.filter(
						entity_type=entity_type,
						group_type=group_type,
						group_id=self.marker.id,
					)
			self.assertEqual(len(queryset), 0)
			
			# 2) append object to marker:
			response = self.client.post(url, {
					'id': 1,
					'ordering': i
				},
				HTTP_X_CSRFTOKEN=self.csrf_token
			)
			self.assertEqual(response.status_code, 201)
			
			#3) Make sure it's in there:
			#have to re-instantiate the query b/c it's cached: 
			queryset = models.EntityGroupAssociation.objects.filter(
						entity_type=entity_type,
						group_type=group_type,
						group_id=self.marker.id,
					)
			self.assertEqual(len(queryset), 1)
			
	
	def test_remove_media_from_marker(self, **kwargs):
		'''
		Important note:  the HTTP_X_CSRFTOKEN header must be set for
		a successful delete using Session Authentication
		(had to dig through Django's middleware/csrf.py to sort that out)
		'''
		group_type = models.Marker.get_content_type()
		for i, url in enumerate(self.urls):
			entity_type = models.Base.get_model(
					model_name_plural=url.split('/')[-2]
				).get_content_type()
			
			# 0)  Attach media to marker
			self.create_relation(entity_type, id=1)
			
			# 1) make sure that the object is appended to the marker:
			queryset = models.EntityGroupAssociation.objects.filter(
						entity_type=entity_type,
						entity_id=1,
						group_type=group_type,
						group_id=self.marker.id,
					)
			self.assertEqual(len(queryset), 1)
			
			# 2) remove object from marker:
			response = self.client.delete('%s1/' % url,
				HTTP_X_CSRFTOKEN=self.csrf_token
			)
			#print response.content
			self.assertEqual(response.status_code, 200)
			
			# 3) ensure object has been removed from the marker:
			#have to re-instantiate the query b/c it's cached: 
			queryset = models.EntityGroupAssociation.objects.filter(
						entity_type=entity_type,
						entity_id=1,
						group_type=group_type,
						group_id=self.marker.id,
					)
			self.assertEqual(len(queryset), 0)
			
	def test_update_relation_using_put(self, **kwargs):
		'''
		Test Client still a bit idiosyncratic.  Unlike for POST
		requests, for PUT requests, you need to 1) manually set
		the content type (which means that you also have to
		urlencode the params dictionary)
		https://github.com/jgorset/django-respite/issues/38
		'''
		group_type = models.Marker.get_content_type()
		for i, url in enumerate(self.urls):
			entity_type = models.Base.get_model(
					model_name_plural=url.split('/')[-2]
				).get_content_type()
			
			# Attach media to marker
			relation = self.create_relation(entity_type, id=1)
			self.assertEqual(relation.ordering, 1)
			self.assertEqual(relation.turned_on, False)
			import urllib
			response = self.client.put('%s1/' % url,
				data=urllib.urlencode({
					'ordering': 5,
					'turned_on': True
				}),
				HTTP_X_CSRFTOKEN=self.csrf_token,
				content_type = "application/x-www-form-urlencoded"
			)
			self.assertEqual(response.status_code, 200)
			updated_relation = models.EntityGroupAssociation.objects.get(id=relation.id)
			self.assertEqual(updated_relation.ordering, 5)
			self.assertEqual(updated_relation.turned_on, True)
			
	def test_update_relation_using_patch(self, **kwargs):
		group_type = models.Marker.get_content_type()
		for i, url in enumerate(self.urls):
			entity_type = models.Base.get_model(
					model_name_plural=url.split('/')[-2]
				).get_content_type()
			
			# Attach media to marker
			relation = self.create_relation(entity_type, id=1)
			self.assertEqual(relation.turned_on, False)
			import urllib
			response = self.client.patch('%s1/' % url,
				data=urllib.urlencode({
					'turned_on': True
				}),
				HTTP_X_CSRFTOKEN=self.csrf_token,
				content_type = "application/x-www-form-urlencoded"
			)
			self.assertEqual(response.status_code, 200)
			updated_relation = models.EntityGroupAssociation.objects.get(id=relation.id)
			self.assertEqual(updated_relation.turned_on, True)
		
				

		