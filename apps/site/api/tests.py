'''
from django.http import HttpRequest
from django.template.loader import render_to_string
'''
from django.core.urlresolvers import resolve
from django.test import Client, TestCase
from localground.apps.site.api import views
from django.test.client import RequestFactory
from django.contrib.auth.models import User 

class APITestMixin(object):
	
	'''
	def test_home_page_200_status_anonymous_user(self):
		response = self.client.get(self.url)
		self.assertEqual(response.status_code, 200)
	'''
	
	def test_home_page_200_status_basic_user(self):
		self.factory = RequestFactory()
		request = self.factory.get(self.url)
		self.user = User.objects.create_user('tester',
			first_name='test', email='', password='top_secret'
		)
		request.user = self.user

		# Test my_view() as if it were deployed at /customer/details
		response = self.view(request)
		
		#response = self.client.get(self.url)
		self.assertEqual(response.status_code, 200)
		
	def test_page_resolves_to_view(self):
		func = resolve(self.url).func
		func_name = '{}.{}'.format(func.__module__, func.__name__)
		view_name = '{}.{}'.format(self.view.__module__, self.view.__name__)
		self.assertEqual(func_name, view_name)
		
	class Meta:
		abstract = True
	
class ApiHomePageTest(TestCase, APITestMixin):
	def setUp(self):
		self.url = '/api/0/'
		self.view = views.api_root
	
	def test_home_page_has_required_links(self):
		client = Client()
		response = client.get(self.url)
		for item in [
			'projects', 'photos', 'audio', 'users', 'groups', 'markers'
		]: self.assertIn(item, response.content)
			
class ApiProjectsTest(TestCase, APITestMixin):
	
	def setUp(self):
		self.url =  '/api/0/projects/'
		self.view = views.ProjectList.as_view()
		
		