from django import test
from localground.apps.site.views import sharing
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin
import urllib
from rest_framework import status


class ObjectShareFormProfileTest(test.TestCase, ViewMixin):

    def setUp(self):
        ViewMixin.setUp(self, load_fixtures=False)
        self.urls = [
            '/profile/projects/1/share/',
            '/profile/projects/1/share/embed/',
            '/profile/projects/create/',
            '/profile/projects/create/embed/'
        ]
        self.view = sharing.create_update_group_with_sharing

    def test_share_unshare_project(self, **kwargs):
        slug = 'test-project-slug'

        # project should not be shared with any users:
        self.assertEqual(len(self.project.users.all()), 0)

        # create 2 new users:
        user_1 = self.create_user(username='test1')
        user_2 = self.create_user(username='test2')

        # share w/2 users and change the slug:
        data = {
            'id': self.project.id,
            'access_authority': self.project.access_authority.id,
            'owner_autocomplete': self.project.owner.username,
            'slug': slug,
            'groupuser-0-user_autocomplete': 'test1',
            'groupuser-0-authority': 1,
            'groupuser-1-user_autocomplete': 'test2',
            'groupuser-1-authority': 2
        }
        management_form = {
            'groupuser-TOTAL_FORMS': 2,
            'groupuser-INITIAL_FORMS': 0,
            'groupuser-MAX_NUM_FORMS': 1000
        }
        data.update(management_form)
        response = self.client_user.post(
            '/profile/%s/%s/share/' %
            (self.project.model_name_plural,
             self.project.id),
            data=urllib.urlencode(data),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")

        # successfully redirected
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        # re-query
        new_object = models.Project.objects.get(id=self.project.id)

        # project should be shared w/2 users
        users = new_object.users.all()
        user_ids = [u.id for u in users]
        self.assertEqual(len(new_object.users.all()), 2)

        # slug should be changed
        self.assertEqual(new_object.slug, slug)

        #----------------------------------------------
        # now unshare with test1
        #----------------------------------------------
        data = {
            'id': self.project.id,
            'access_authority': self.project.access_authority.id,
            'owner_autocomplete': self.project.owner.username,
            'slug': slug,
            'groupuser-0-id': user_ids[0],
            'groupuser-0-user_autocomplete': 'test1',
            'groupuser-0-authority': 2,
            'groupuser-0-DELETE': 'on',
            'groupuser-1-id': user_ids[1],
            'groupuser-1-user_autocomplete': 'test2',
            'groupuser-1-authority': 2
        }
        management_form = {
            'groupuser-TOTAL_FORMS': 2,
            'groupuser-INITIAL_FORMS': 2,
            'groupuser-MAX_NUM_FORMS': 1000
        }
        data.update(management_form)
        response = self.client_user.post(
            '/profile/%s/%s/share/' %
            (self.project.model_name_plural,
             self.project.id),
            data=urllib.urlencode(data),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        
        # successfully redirected
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

        # re-query
        new_object = models.Project.objects.get(id=self.project.id)

        # project should be shared w/2 users
        self.assertEqual(len(new_object.users.all()), 1)
