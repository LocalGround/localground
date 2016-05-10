from localground.apps.site.tests import Client, ModelMixin
from django.core.urlresolvers import resolve
from rest_framework import status


class ViewMixinAPISuperuser(ModelMixin):
    
    def setUp(self, load_fixtures=False):
        ModelMixin.setUp(self, load_fixtures=load_fixtures)

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
    
    def setUp(self, load_fixtures=False):
        ModelMixin.setUp(self, load_fixtures=load_fixtures)

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
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
            
    def test_check_metadata(self):
        for url in self.urls:
            response = self.client_user.options(url,
                                HTTP_X_CSRFTOKEN=self.csrf_token,
                                content_type="application/x-www-form-urlencoded"
                            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            try:
                fields = response.data['actions'].get('PUT') or response.data['actions'].get('POST')
            except:
                #print('no PUT or POST')
                return

            #ensure that dictionary is not empty:
            self.assertFalse(not fields)
            
            #ensure that the two dictionaries are the same length:
            self.assertEqual(len(fields.keys()), len(self.metadata.keys()))
            
            #ensure that field specs match:
            for key in self.metadata.keys():
                try:
                    self.assertEqual(fields[key]['type'], self.metadata[key]['type'])
                    self.assertEqual(fields[key]['required'], self.metadata[key]['required'])
                    self.assertEqual(fields[key]['read_only'], self.metadata[key]['read_only'])
                except:
                    raise Exception(
                        self.debug_metadata(key, fields[key], self.metadata[key])
                    )
                    
    
    def debug_metadata(self, key, actual, ideal):
        s = '\n {0} \nERROR: API Endpoint Mismatch for {1}:\n'
        s += 'Actual: {2}\n Target: {3}\n'
        s = s.format( '-'*50, key, actual, ideal)
        print s
        return s
