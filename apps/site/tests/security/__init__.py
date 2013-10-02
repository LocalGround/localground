from django import test
from django.contrib.auth.models import AnonymousUser
from localground.apps.site import models
from localground.apps.site.tests import ModelMixin
from rest_framework import status
import urllib
		
class GroupManagementSecurityTest(test.TestCase, ModelMixin):
	
	fixtures = ['initial_data.json', 'test_data.json']
	
	def setUp(self):
		ModelMixin.setUp(self)
		self.groups = [
			self.project,
			self.create_view(self.user)
		]
		
	def test_owner_can_manage(self):
		for group in self.groups:
			self.assertTrue(group.can_manage(self.user))
		
	def test_managers_can_manage(self):
		u = self.create_user(username='mgr')
		for group in self.groups:
			self.add_project_manager(group, u)
			self.assertTrue(group.can_manage(u))
		
	def test_editors_cannot_manage(self):
		u = self.create_user(username='mgr')
		for group in self.groups:
			self.add_project_editor(group, u)
			self.assertFalse(group.can_manage(u))
		
	def test_viewers_cannot_manage(self):
		u = self.create_user(username='mgr')
		for group in self.groups:
			self.add_project_viewer(group, u)
			self.assertFalse(group.can_manage(u))
			
	def test_anonymous_users_cannot_manage(self):
		for group in self.groups:
			self.assertFalse(group.can_manage(AnonymousUser()))
			
	def test_random_users_cannot_manage(self):
		u = self.create_user(username='random')
		for group in self.groups:
			self.assertFalse(group.can_manage(u))
			
class GroupEditSecurityTest(test.TestCase, ModelMixin):
	
	fixtures = ['initial_data.json', 'test_data.json']
	
	def setUp(self):
		ModelMixin.setUp(self)
		self.groups = [
			self.project,
			self.create_view(self.user)
		]
		
	def test_owner_can_edit(self):
		for group in self.groups:
			self.assertTrue(group.can_edit(self.user))
		
	def test_managers_can_edit(self):
		u = self.create_user(username='mgr')
		for group in self.groups:
			self.add_project_manager(group, u)
			self.assertTrue(group.can_edit(u))
		
	def test_editors_can_edit(self):
		u = self.create_user(username='mgr')
		for group in self.groups:
			self.add_project_editor(group, u)
			self.assertTrue(group.can_edit(u))
		
	def test_viewers_cannot_edit(self):
		u = self.create_user(username='mgr')
		for group in self.groups:
			self.add_project_viewer(group, u)
			self.assertFalse(group.can_edit(u))
			
	def test_anonymous_users_cannot_edit(self):
		for group in self.groups:
			self.assertFalse(group.can_edit(AnonymousUser()))
			
	def test_random_users_cannot_edit(self):
		u = self.create_user(username='random')
		for group in self.groups:
			self.assertFalse(group.can_edit(u))
		
		
		