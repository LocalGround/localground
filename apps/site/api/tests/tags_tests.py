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