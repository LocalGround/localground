import os, json, urllib
from django import test
from django.conf import settings
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.gis.geos import GEOSGeometry

p = { "type": "Point", "coordinates": [12.49, 41.89] }
email = 'test@test.org'
first_name = 'Amy'
last_name = 'Jones'
        
class UserProfileList(APITestCase, ViewMixinAPI):
    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/user-profile/.json']
        self.url = self.urls[0]
        self.view = views.UserProfileList.as_view()
        self.metadata = {}
    
    def test_get_user_profile_list(self):
        response = self.client_user.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(len(data.get('results')), 2)

    # test that we are unable to create a user profile
    def test_create_user_profile_list_fails(self):
        response = self.client_user.post(self.url, HTTP_X_CSRFTOKEN=self.csrf_token)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
  
class UserProfileInstance(APITestCase, ViewMixinAPI):
    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.user_profile = models.UserProfile.objects.get(user_id=self.user.id)
        self.user_profile.email_announcements = False
        self.user_profile.save()
        self.user.first_name = 'Lary'
        self.user.last_name = 'Grawl'
        self.user.email = 'test@bla.com'
        self.user.save()
        self.urls = ['/api/0/user-profile/%s/.json' % self.user_profile.id]
        self.url = self.urls[0]
        self.view = views.UserProfileInstance.as_view()
        self.metadata = {
            "url": { "type": "field", "required": False, "read_only": True },
            "id": { "type": "integer", "required": False, "read_only": True },
            "first_name": { "type": "string", "required": False, "read_only": False },
            "last_name": { "type": "string", "required": False, "read_only": False },
            "email": { "type": "string", "required": False, "read_only": False },
            "username": { "type": "string", "required": False, "read_only": True },
            "email_announcements": { "type": "boolean", "required": True, "read_only": False },
            "default_view_authority": { "type": "field", "required": False, "read_only": False },
            "default_location": { "type": "geojson", "required": False, "read_only": False },
            "contacts":{ "type": "field", "required": False, "read_only": True },
            "date_created": { "type": "datetime", "required": False, "read_only": True },
            "time_stamp": { "type": "datetime", "required": False, "read_only": True },
            "user": { "type": "field", "required": False, "read_only": True }
        }

    def test_get_user_profile(self):
        response = self.client_user.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)
        self.assertEqual(data.get('username'),'tester')
        self.assertEqual(data.get('first_name'), 'Lary')
        self.assertEqual(data.get('last_name'), 'Grawl')
        self.assertEqual(data.get('email'), 'test@bla.com')
        self.assertTrue('url' in data)
        self.assertTrue('time_stamp' in data)
        self.assertTrue('user' in data)
        self.assertTrue('date_created' in data)
        self.assertFalse(data.get('email_announcements'))
        self.assertTrue('id' in data)
        self.assertTrue('default_location' in data)
        self.assertTrue('default_view_authority' in data)

    # test that we are unable to delete a user profile
    def test_delete_user_profile_fails(self):
        response = self.client_user.delete(self.url, HTTP_X_CSRFTOKEN=self.csrf_token)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
    def test_can_only_access_ones_own_userprofile_unless_superuser(self):
        tester1 = self.create_user(username='tester1')
        superuser = self.create_superuser()
        self.client.force_authenticate(user=tester1)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.force_authenticate(user=superuser)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_params(self):
        params = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'default_view_authority': 2,
            'default_location': p,
            'email_announcements': 'true'
        }
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode(params), 
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        #ensure response dictionary:
        data = json.loads(response.content)
        self.assertEqual(data.get('first_name'), first_name)
        self.assertEqual(data.get('last_name'), last_name)
        self.assertEqual(data.get('email'), email)
        self.assertEqual(data.get('default_view_authority'), 2)
        self.assertEqual(data.get('default_location'), p)
        self.assertEqual(data.get('email_announcements'), True)
        
        # ensure database commit:
        user_profile = models.UserProfile.objects.get(id=self.user_profile.id)
        self.assertEqual(user_profile.user.first_name, first_name)
        self.assertEqual(user_profile.user.last_name, last_name)
        self.assertEqual(user_profile.user.email, email)
        self.assertEqual(user_profile.default_view_authority.id, 2)
        self.assertEqual(user_profile.default_location, GEOSGeometry(json.dumps(p)))
        self.assertTrue(user_profile.email_announcements)

    def test_patch_location_email(self):
        params = {
            'email': email,
            'default_location': p
        }
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode(params), 
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        #ensure response dictionary:
        data = json.loads(response.content)
        self.assertEqual(data.get('email'), email)
        self.assertEqual(data.get('default_location'), p)
        
        # ensure database commit:
        user_profile = models.UserProfile.objects.get(id=self.user_profile.id)
        self.assertEqual(user_profile.user.email, email)
        self.assertEqual(user_profile.default_location, GEOSGeometry(json.dumps(p)))

