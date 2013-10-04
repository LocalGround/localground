from django import test
from django.contrib.auth.models import AnonymousUser
from localground.apps.site import models
from localground.apps.site.managers.base import GenericLocalGroundError
from localground.apps.site.tests import ModelMixin
from rest_framework import status
import urllib
		
class BatchPhotoQuerySecurityTest(test.TestCase, ModelMixin):
	
	fixtures = ['initial_data.json', 'test_data.json']
	
	def setUp(self):
		ModelMixin.setUp(self)
		
		#create 3 users:
		self.users = [self.create_user(username=u)
							for u in ['u1', 'u2', 'u3']]
		# create 3 projects (1 per user):
		self.projects = []
		for i, user in enumerate(self.users):
			self.projects.append(
				self.create_project(
					self.users[i],
					name='Project #%s' % (i+1),
					authority_id=1
				)
			)
		
		#create 3 photos per project:
		self.photos = []
		file_names = ['photo_1.jpg', 'photo_2.jpg', 'photo_3.jpg']
		for project in self.projects:
			for i, fn in enumerate(file_names):
				self.photos.append(
					self.create_photo(
						project.owner, project,
						name='Photo #%s' % (i+1),
						file_name=fn
					)
				)
		
	def test_owner_can_view_objects(self):
		self.assertEqual(
			3,
			len(models.Photo.objects.get_objects(self.users[0]))
		)
		
	def test_owner_can_edit_objects(self):
		self.assertEqual(
			3,
			len(models.Photo.objects.get_objects_editable(self.users[0]))
		)
		
	def test_anonymous_cannot_view_objects(self):
		allows_query = True
		try:
			models.Photo.objects.get_objects(AnonymousUser())
		except GenericLocalGroundError:
			allows_query = False
		self.assertFalse(allows_query)
	
	def test_viewer_can_view_objects(self, ):
		# grant user(1) view privs to project(0):
		self.add_project_viewer(self.projects[0], self.users[1])
		
		#user(1) should be able to view 6 projects....
		self.assertEqual(
			6,
			len(models.Photo.objects.get_objects(self.users[1]))
		)
		#user(1) should only be able to edit 3 projects...
		self.assertEqual(
			3,
			len(models.Photo.objects.get_objects_editable(self.users[1]))
		)
	
	def test_anonymous_cannot_edit_objects(self):
		allows_query = True
		try:
			models.Photo.objects.get_objects_editable(AnonymousUser())
		except GenericLocalGroundError:
			allows_query = False
		self.assertFalse(allows_query)
		
	def test_editor_can_view_and_edit_objects(self, ):
		self.add_project_editor(self.projects[0], self.users[1])
		self.assertEqual(
			6,
			len(models.Photo.objects.get_objects(self.users[1]))
		)
		self.assertEqual(
			6,
			len(models.Photo.objects.get_objects_editable(self.users[1]))
		)
		
	def test_manager_can_view_and_edit_objects(self, ):
		self.add_project_manager(self.projects[0], self.users[1])
		self.assertEqual(
			6,
			len(models.Photo.objects.get_objects(self.users[1]))
		)
		self.assertEqual(
			6,
			len(models.Photo.objects.get_objects_editable(self.users[1]))
		)
		
	def test_public_can_view_objects(self):
		self.assertEqual(
			0,
			len(models.Photo.objects.get_objects_public())
		)
		
		#first, set all projects to public:
		oa = models.ObjectAuthority.objects.get(id=models.ObjectAuthority.PUBLIC)
		for project in self.projects:
			project.access_authority = oa
			project.save()
		
		self.assertEqual(
			9,
			len(models.Photo.objects.get_objects_public())
		)
	
			
		