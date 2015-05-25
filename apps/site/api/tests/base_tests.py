from localground.apps.site.tests import Client, ModelMixin
from django.core.urlresolvers import resolve
from rest_framework import status


class ViewMixinAPISuperuser(ModelMixin):
    fixtures = ['test_data.json'] #'initial_data.json', 

    def setUp(self):
        ModelMixin.setUp(self)

    def test_page_403_or_302_status_anonymous_user(self, urls=None):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_anonymous.get(url)
            self.assertIn(response.status_code, [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN,
                status.HTTP_302_FOUND
            ])

    def test_page_403_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_user.get(url)
            request_user = response.context['user']
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_page_200_status_superuser(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_superuser.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_page_resolves_to_view(self, urls=None):
        if urls is None:
            urls = self.urls
        for url in urls:
            func = resolve(url).func
            func_name = '{}.{}'.format(func.__module__, func.__name__)
            view_name = '{}.{}'.format(
                self.view.__module__,
                self.view.__name__)
            self.assertEqual(func_name, view_name)


class ViewMixinAPI(ModelMixin):
    fixtures = ['test_data.json'] #'initial_data.json', 

    def setUp(self):
        ModelMixin.setUp(self)

    '''
	This generic test no longer makes sense, because some pages will
	be accessible, while others won't.  Commenting out for now.
	def test_page_403_or_302_status_anonymous_user(self, urls=None):
		if urls is None:
			urls = self.urls
		for url in urls:
			response = self.client_anonymous.get(url)
			self.assertIn(response.status_code, [
				status.HTTP_302_FOUND,
				status.HTTP_403_FORBIDDEN
			])
	'''

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            # print url
            response = self.client_user.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_page_resolves_to_view(self, urls=None):
        if urls is None:
            urls = self.urls
        for url in urls:
            func = resolve(url).func
            func_name = '{}.{}'.format(func.__module__, func.__name__)
            view_name = '{}.{}'.format(
                self.view.__module__,
                self.view.__name__)
            # print url, func_name, view_name
            self.assertEqual(func_name, view_name)
