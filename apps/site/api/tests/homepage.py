from django import test
from localground.apps.site.api import views
from localground.apps.site.tests import ViewMixin
from rest_framework import status

class ApiHomePageTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/']
		self.view = views.api_root
	
	def test_page_has_required_links(self):
		for url in self.urls:
			response = self.client.get(url)
			if response.status_code == status.HTTP_200_OK:
				for item in [
					'projects', 'photos', 'audio', 'users', 'groups', 'markers'
				]: self.assertIn(item, response.content)