from django.core.urlresolvers import resolve
from django.test import Client, TestCase
from localground.apps.site.api import views
from localground.apps.site import models
from django.test.client import RequestFactory
from django.contrib.auth.models import User

class APIDataMixin(object):
	def create_user(self):
		return User.objects.create_user('tester',
			first_name='test', email='', password='top_secret'
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
	
	def test_page_403_status_anonymous_user(self):
		for url in self.urls:
			response = self.client.get(url)
			self.assertEqual(response.status_code, 403)
	
	def _resolve_url_view(self, url, **kwargs):
		request = self.factory.get(url)
		request.user = self.user
		response = self.view(request, **kwargs)
		self.assertEqual(response.status_code, 200)
	
	def test_page_200_status_basic_user(self, **kwargs):
		self.factory = RequestFactory()
		for url in self.urls:
			self._resolve_url_view(url, **kwargs)
			
		
	def test_page_resolves_to_view(self):
		for url in self.urls:
			func = resolve(url).func
			func_name = '{}.{}'.format(func.__module__, func.__name__)
			view_name = '{}.{}'.format(self.view.__module__, self.view.__name__)
			#print func_name, view_name
			self.assertEqual(func_name, view_name)
	
	'''		
	def tearDown(self):
		self.project.delete()
		self.user.delete()
	'''
	
class ApiHomePageTest(TestCase, APITestMixin):
	def setUp(self):
		APITestMixin.setUp(self)
		self.urls = ['/api/0/']
		self.view = views.api_root
	
	def test_page_has_required_links(self):
		client = Client()
		for url in self.urls:
			response = client.get(url)
			if response.status_code == 200:
				for item in [
					'projects', 'photos', 'audio', 'users', 'groups', 'markers'
				]: self.assertIn(item, response.content)


class ApiProjectListTest(TestCase, APITestMixin):
	
	def setUp(self):
		APITestMixin.setUp(self)
		self.urls =  ['/api/0/projects/']
		self.view = views.ProjectList.as_view()
		

class ApiMarkerListTest(TestCase, APITestMixin):
	
	def setUp(self):
		APITestMixin.setUp(self)
		self.urls =  ['/api/0/markers/']
		self.view = views.MarkerList.as_view()
		

class ApiMarkerInstanceTest(TestCase, APITestMixin):
	
	def setUp(self):
		APITestMixin.setUp(self)
		self.marker = self.get_marker()
		self.urls = ['/api/0/markers/%s/' % self.marker.id]
		self.view = views.MarkerInstance.as_view()
		
	def test_page_200_status_basic_user(self, **kwargs):
		APITestMixin.test_page_200_status_basic_user(self, pk=self.marker.id)
	
class ApiRelatedMediaListTest(TestCase, APITestMixin):
	def setUp(self):
		APITestMixin.setUp(self)
		self.marker = self.get_marker()
		self.urls = [
			'/api/0/markers/%s/photos/' % self.marker.id,
			'/api/0/markers/%s/audio/' % self.marker.id
		]
		self.view = views.RelatedMediaList.as_view()
		
	def test_page_200_status_basic_user(self, **kwargs):
		self.factory = RequestFactory()
		for url in self.urls:
			self._resolve_url_view(
				url,
				group_id=self.marker.id,
				entity_name_plural=url.split('/')[-2]
			)
		