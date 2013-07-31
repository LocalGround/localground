from django import test
from django.core.urlresolvers import resolve
from rest_framework import status
from localground.apps.site import models
from django.contrib.auth.models import User

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
	
	
class ModelMixin(object):
	user_password = 'top_secret'
	
	class Meta:
		anstract = True
	
	def setUp(self):
		self._user = None
		self._project = None
	
	@property  
	def user(self):
		if self._user is None:
			self._user = self.get_user()
		return self._user
	
	@property  
	def project(self):
		if self._project is None:
			self._project = self.get_project()
		return self._project
	
	def create_user(self):
		return User.objects.create_user('tester',
			first_name='test', email='', password=self.user_password
		)
	
	def get_user(self, user_id=1):
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


class ViewMixin(ModelMixin):
	fixtures = ['initial_data.json', 'test_data.json']
	
	def setUp(self):
		ModelMixin.setUp(self)
		self._csrf_token = None
		self.client = self._get_client()
		
	@property  
	def csrf_token(self):
		if self._csrf_token is None:
			c = Client()
			response = c.get('/accounts/login/')
			self._csrf_token = unicode(response.context['csrf_token'])
		return self._csrf_token
		
	def _get_client(self):
		c = Client(enforce_csrf_checks=True)
		c.login(username='tester', password=self.user_password)
		c.cookies['csrftoken'] = self.csrf_token
		return c
	
	def test_page_403_or_302_status_anonymous_user(self, urls=None):
		if urls is None:
			urls = self.urls
		c = Client() #don't use credentialed client
		for url in urls:
			response = c.get(url)
			self.assertIn(response.status_code, [
				status.HTTP_302_FOUND,
				status.HTTP_403_FORBIDDEN
			])
	
	def test_page_200_status_basic_user(self, urls=None, **kwargs):
		if urls is None:
			urls = self.urls
		for url in urls:
			response = self.client.get(url)
			self.assertEqual(response.status_code, status.HTTP_200_OK)
		
	def test_page_resolves_to_view(self, urls=None):
		if urls is None:
			urls = self.urls
		for url in urls:
			func = resolve(url).func
			func_name = '{}.{}'.format(func.__module__, func.__name__)
			view_name = '{}.{}'.format(self.view.__module__, self.view.__name__)
			#print url, func_name, view_name
			self.assertEqual(func_name, view_name)
	

from localground.apps.site.api.tests import *
from localground.apps.site.tests.views import *