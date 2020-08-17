from django import test
from localground.apps.site.views.pages import PublicView
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin
from rest_framework import status
import urllib


class PresentationTest(test.TestCase, ViewMixin):

    def setUp(self):
        ViewMixin.setUp(self)
        import hashlib
        md5 = hashlib.md5('123'.encode('utf-8'))
        self.map = self.create_styled_map()
        self.map.password = md5.hexdigest()
        self.urls = ['/maps/{0}/'.format(self.map.slug)]
        self.url = self.urls[0]
        self.view = PublicView.as_view(template_name='pages/presentation.html')

    def test_page_403_or_302_status_anonymous_user(self):
        pass

    def test_page_200_status_anonymous_user(self):
        response = self.client_anonymous.get(self.url)
        html_response = response.rendered_content
        self.assertTrue(html_response.find('mapJSON') > -1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_page_200_status_logged_in_user(self):
        response = self.client.get(self.url)
        html_response = response.rendered_content
        
        self.assertTrue(html_response.find('mapJSON') > -1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cannot_access_password_protected_on_get_request(self):
        self.map.metadata['accessLevel'] = 3
        self.map.save()
        response = self.client_anonymous.get(self.url)
        html_response = response.rendered_content
        
        self.assertEqual(html_response.find('mapJSON'), -1)
        self.assertTrue(html_response.find('<form') > -1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_can_access_password_protected_on_post_request_with_password(self):
        self.map.metadata['accessLevel'] = 3
        self.map.save()
        # print self.csrf_token
        self.client_anonymous.cookies['csrftoken'] = self.csrf_token
        response = self.client_anonymous.post(
            self.url,
            data=urllib.parse.urlencode({
                'access_key': '123'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
       
        html_response = response.rendered_content
        self.assertTrue(html_response.find('mapJSON') > -1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cannot_access_password_protected_map_with_bad_password(self):
        self.map.metadata['accessLevel'] = 3
        self.map.save()
        # print self.csrf_token
        self.client_anonymous.cookies['csrftoken'] = self.csrf_token
        response = self.client_anonymous.post(
            self.url,
            data=urllib.parse.urlencode({
                'access_key': '12345'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")

        html_response = response.rendered_content

        self.assertTrue(html_response.find('projectJSON') == -1)
        self.assertTrue(html_response.find('mapJSON') == -1)
        self.assertTrue(html_response.find('Incorrect password') > -1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
