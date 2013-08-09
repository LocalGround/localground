from django import test
from localground.apps.site.views import profile
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin
import urllib
from rest_framework import status
		
class ObjectListFormProfileTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/profile/photos/',
					 '/profile/audio/',
					 '/profile/prints/',
					 '/profile/map-images/',
					 '/profile/forms/'
		]
		self.view = profile.object_list_form
		
	def _delete_batch(self, model, create_function=None):
		ids = [1, 2]
		if create_function is not None:
			a = create_function()
			b = create_function()
			ids = [a.id, b.id]
		# ensure that both photos exist:
		self.assertEqual(len(model.objects.filter(id__in=ids)), 2)
	
		# Delete over HTTP (using POST)
		url = '/profile/%s/delete/batch/' % model.model_name_plural
		response = self.client.post(url,
			data='id=%s&id=%s' % (ids[0], ids[1]),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
		# ensure that both photos have been deleted:
		self.assertEqual(len(model.objects.filter(id__in=[1,2])), 0)
		
	def test_batch_delete_photos_post(self, **kwargs):
		#photos already populated via fixtures
		self._delete_batch(models.Photo)
		
	def test_batch_delete_audio_post(self, **kwargs):
		#audio already populated via fixtures
		self._delete_batch(models.Audio)
		
	def test_batch_delete_print_post(self, **kwargs):
		self._delete_batch(models.Print, create_function=self.create_print)
		
	def test_batch_delete_form_post(self, **kwargs):
		self._delete_batch(models.Form, create_function=self.create_form)
		

class ObjectShareFormProfileTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = [
			'/profile/projects/1/share/',
			'/profile/projects/1/share/embed/',
			'/profile/projects/create/',
			'/profile/projects/create/embed/'
		]
		self.view = profile.create_update_group_with_sharing
		
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
		response = self.client.post('/profile/%s/%s/share/' % \
						(self.project.model_name_plural, self.project.id),
			data=urllib.urlencode(data),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		
		#successfully redirected
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
			'groupuser-0-id': 1,
			'groupuser-0-user_autocomplete': 'test1',
			'groupuser-0-authority': user_ids[0],
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
		response = self.client.post('/profile/%s/%s/share/' % \
						(self.project.model_name_plural, self.project.id),
			data=urllib.urlencode(data),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		
		#successfully redirected
		self.assertEqual(response.status_code, status.HTTP_302_FOUND)
		
		# re-query 
		new_object = models.Project.objects.get(id=self.project.id)
		
		# project should be shared w/2 users
		self.assertEqual(len(new_object.users.all()), 1)
		
		
		
		
	
		