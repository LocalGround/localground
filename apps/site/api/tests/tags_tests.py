from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ModelMixin
from rest_framework import status

class ApiTagListTest(test.TestCase, ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)
        #self.urls = ['/api/0/tags/']
        #self.view = views.TagList.as_view()
        #self.metadata = { }

        #create 1 photo and 1 audio object:
        self.photo = self.create_photo(self.user, self.project, tags=['cat', 'dog', 'horse'])
        self.audio = self.create_audio(self.user, self.project, tags=['mouse', 'rat', 'cat'])

    def test_retrieve_tags(self, **kwargs):
        response = self.client_user.get('/api/0/tags/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5)
        self.assertItemsEqual(['cat', 'dog', 'horse', 'rat', 'mouse'], response.data)
        response = self.client_user.get('/api/0/tags/?term=ca')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertItemsEqual(['cat'], response.data)
        
    def test_project_tags_dont_cross_without_permission(self, **kwargs):
        # 1. create a second user & client
        from localground.apps.site.api.tests import Client
        random_user = self.create_user(username='rando')
        client_random_user = Client(enforce_csrf_checks=True)
        client_random_user.login(
            username=random_user.username,
            password=self.user_password
        )
        client_random_user.cookies['csrftoken'] = self.csrf_token
        
        # 2. assign dummy data to second user:
        random_project = self.create_project(random_user)
        photo2 = self.create_photo(random_user, random_project, tags=['bird', 'frog', 'lizard'])
        audio2 = self.create_audio(random_user, random_project, tags=['bear', 'lion'])
        
        # 3. check that the default user can only access tags for which they have permission:
        response = self.client_user.get('/api/0/tags/')
        self.assertEqual(len(response.data), 5)
        self.assertItemsEqual(['cat', 'dog', 'horse', 'rat', 'mouse'], response.data)
        
        # 4. check that the random_user can only access tags for which they have permission:
        response = client_random_user.get('/api/0/tags/')
        self.assertEqual(len(response.data), 5)
        self.assertItemsEqual(['bird', 'frog', 'lizard', 'bear', 'lion'], response.data)
        
        # 5. grant the default user access to the random project, and check that user can
        #    now access tags from both projects:
        self.grant_project_permissions_to_user(random_project, self.user, authority_id=1)
        response = self.client_user.get('/api/0/tags/')
        self.assertEqual(len(response.data), 10)
        self.assertItemsEqual(['bird', 'frog', 'lizard', 'bear', 'lion', 'cat', 'dog', 'horse', 'rat', 'mouse'], response.data)
        
        
        