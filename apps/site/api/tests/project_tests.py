from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
from rest_framework import status

class ApiProjectListTest(test.TestCase, ViewMixinAPI):
	
	def setUp(self):
		ViewMixinAPI.setUp(self)
		self.url =  '/api/0/projects/'
		self.urls =  [ self.url ]
		self.model = models.Project
		self.view = views.ProjectList.as_view()
		
	def test_create_project_using_post(self, **kwargs):
		name = 'New Project!'
		description = 'New project description'
		tags= "d, e, f"
		slug = 'new-project-123'
		response = self.client_user.post(self.url,
			data=urllib.urlencode({
				'name': name,
				'description': description,
				'tags': tags,
				'slug': slug
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