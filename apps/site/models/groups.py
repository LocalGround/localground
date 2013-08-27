#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models.permissions import \
		BasePermissions, UserAuthority, ObjectAuthority
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType

from localground.apps.site.models.barcoded import Scan
from localground.apps.site.models.photo import Photo
from localground.apps.site.models.audio import Audio
from localground.apps.site.models.video import Video
from localground.apps.site.models import \
	Marker, WMSOverlay, ObjectTypes, BaseNamed, BaseGenericRelationMixin

from localground.apps.site.managers import ProjectManager, ViewManager


from django.contrib.gis.db import models
from datetime import datetime

class Group(BaseNamed, BaseGenericRelationMixin, BasePermissions):
	"""
	Abstract class that extends BasePermissions; provides helper methods to
	determine whether a user has read/write/manage permissions on an object.
	"""
	RESTRICT_BY_USER = True
	extents = models.PolygonField(null=True, blank=True)
	slug = models.SlugField(verbose_name="Friendly URL", max_length=100, unique=True, db_index=True,
								help_text='A few words, separated by dashes "-", to be used as part of the url')
	basemap = models.ForeignKey('WMSOverlay', default=12) #default to grayscale
	
	class Meta:
		abstract = True
		app_label = 'site'
		
	@classmethod
	def filter_fields(cls):
		from localground.apps.lib.helpers import QueryField, FieldTypes
		return [
			QueryField('name', id='name', title='Name', operator='like'),
			QueryField('description', id='description', title='Description', operator='like'),
			QueryField('tags', id='tags', title='Tags', data_type=FieldTypes.TAG, operator='in'),
			QueryField('owner__username', id='owned_by', title='Owned By'),
			QueryField('date_created', id='date_created_after', title='After',
										data_type=FieldTypes.DATE, operator='>='),
			QueryField('date_created', id='date_created_before', title='Before',
										data_type=FieldTypes.DATE, operator='<=')
		]
		
	@staticmethod
	def get_users():
		# Returns a list of user that own or have access to at least one project.
		from django.db.models import Q
		from django.contrib.auth.models import User
		return User.objects.distinct().filter(
				Q(project__isnull=False) | Q(userauthorityobject__isnull=False)
				).order_by('username',)
	
		
	def share_url(self):
		return '/profile/{0}/{1}/share/'.format(self.model_name_plural, self.id)
	
	def _has_authority(self, user, user_authority_id, access_key=None):
		# 1) if user is superuser or user is owner, then has authority:
		#if user and (user.is_superuser or user == self.owner):
		if user and user == self.owner:
			return True
		
		# 2) if just view permissions, check if project/view is public or
		#    if a valid key has been supplied:
		if user_authority_id == UserAuthority.CAN_VIEW:
			if self.access_authority.id == ObjectAuthority.PUBLIC:
				return True
			elif self.access_authority.id == ObjectAuthority.PUBLIC_WITH_LINK:
				if access_key == self.access_key:
					return True
				
		# 3) finally, if user is logged in, see if user has been granted
		#    the appropriate authority: 
		if user and user.is_authenticated():
			recs = self.users.select_related('authority__id').filter(user=user)
			for rec in recs:
				if rec.authority.id >= user_authority_id:
					return True
		return False
	
	def can_view(self, user, access_key=None):
		return self._has_authority(user, UserAuthority.CAN_VIEW, access_key)

	def can_edit(self):
		return self._has_authority(user, UserAuthority.CAN_EDIT)
	
	def can_manage(self):
		return self._has_authority(user, UserAuthority.CAN_MANAGE)
	
	
class Project(Group):
	"""
	Default grouping for user-generated content.  Every media type must be
	associated with one and only one project.  Think of a project as a folder
	where users can file their media.  Has helper functions for retrieving all
	media associated with a particular project (for the JavaScript API).
	"""
	objects = ProjectManager()
	def __str__(self):
		return '%s - %s' % self.id, self.name
	
	
	class Meta(Group.Meta):
		verbose_name = 'project'
		verbose_name_plural = 'projects'
	
	@classmethod
	def inline_form(cls, user=None):
		from localground.apps.site.forms import ProjectInlineUpdateForm
		return ProjectInlineUpdateForm
	
	@classmethod
	def sharing_form(cls):
		from localground.apps.site.forms import ProjectPermissionsForm
		return ProjectPermissionsForm
		
	@classmethod
	def get_form(cls):
		from localground.apps.site.forms import ProjectCreateForm
		return ProjectCreateForm
	
	def to_dict(self, include_auth_users=False, include_processed_maps=False,
				include_markers=False, include_audio=False, include_photos=False,
				include_tables=False):
		d = {
			'id': self.id,
			'name': self.name,  
			'description': self.description,
			'owner': self.owner.username
		}
		data = []
		if include_processed_maps:
			data.append({
				'id': ObjectTypes.SCAN,
				'overlayType': ObjectTypes.SCAN,
				'name': 'Drawings',
				'data': Scan.objects.by_project(self, processed_only=True).to_dict_list()
			})
		if include_audio:
			data.append({
				'id': ObjectTypes.AUDIO,
				'overlayType': ObjectTypes.AUDIO,
				'name': 'Audio Files',
				'data': Audio.objects.by_project(self, ordering_field='name').to_dict_list() 
			})
		if include_photos:
			data.append({
				'id': ObjectTypes.PHOTO,
				'overlayType': ObjectTypes.PHOTO,
				'name': 'Photos',
				'data': Photo.objects.by_project(self, ordering_field='name').to_dict_list() 
			})
		'''
		if include_markers:
			data.append({
				'id': ObjectTypes.MARKER,
				'overlayType': ObjectTypes.MARKER,
				'name': 'Markers',
				'data': Marker.objects.by_project_with_counts_dict_list(self)
			})
		
		if include_tables:
			data.extend(self.get_table_data(to_dict=True))
		d.update({'data': data})
		'''
		return d
	
	def get_table_data(self, to_dict=True):
		from localground.apps.site.models import Print, Form
		# Projects and forms are tied through site.  So, select all the
		# forms that are tied to prints that are associate with this project:
		
		# Todo: create an at_projects_forms table; add a trigger on each dynamic
		#       table such that each time the dynamic table's project_id field is
		#       updated, a record is inserted into at_projects_forms (if it
		#       doesn't already exist).
		data = []
		forms = Form.objects.prefetch_related('project', 'field_set', 'field_set__data_type').filter(project=self)	
		#forms = Form.objects.filter(project=self)
		for form in forms:
			recs = form.get_objects(user=self.owner, project=self, manually_reviewed=True)
			if len(recs) > 0:
				data.append({
					'id': form.id,
					'overlay_type': ObjectTypes.RECORD,
					'name': form.name,
					'data': [r.to_dict() for r in recs]
				})
				#tables.append(dict(form=form.to_dict(), data=recs))
			
		return data
	
	def __unicode__(self):
		return self.name
	
	@classmethod
	def get_default_project(self, user):
		from django.db.models import Q
		return Project.objects.filter(
				Q(owner=user) | Q(users__user=user)
			).order_by('-time_stamp')[0]
	

	
class View(Group):
	"""
	A user-generated grouping of media.  Media associations are specified in the
	GenericAssociation Model.  Only partially implemented.
	"""
	name = 'view'
	name_plural = 'views'
	objects = ViewManager()
	
	@classmethod
	def sharing_form(cls):
		from localground.apps.site.forms import ViewPermissionsForm
		return ViewPermissionsForm
	
	@classmethod
	def get_form(cls):
		from localground.apps.site.forms import ViewCreateForm
		return ViewCreateForm
		
	def get_markers_with_counts(self):
		"""
		Queries for Markers and also uses raw sql to retrieve how many Audio,
		Photo, Table Records are associated with the marker.
		"""
		marker_ids = [m.id for m in self.markers]
		markers_with_counts = Marker.objects.by_marker_ids_with_counts(marker_ids)
		#append turned_on flag:
		for m in self.markers:
			for m1 in markers_with_counts:
				if m.id == m1.id:
					m1.turned_on = m.turned_on
					break
		return [m.to_dict(aggregate=True) for m in markers_with_counts]
		
	def to_dict(self, include_auth_users=False, include_processed_maps=False,
				include_markers=False, include_audio=False, include_photos=False,
				include_tables=False):
		d = {
			'id': self.id,
			'name': self.name,  
			'description': self.description,
			'owner': self.owner.username
		}
		if include_processed_maps:
			d.update(dict(processed_maps=[rec.to_dict() for rec in self.map_images]))
		if include_audio:
			d.update(dict(audio=[rec.to_dict() for rec in self.audio_files]))
		if include_photos:
			d.update(dict(photos=[rec.to_dict() for rec in self.photos]))
		if include_markers:
			d.update(dict(markers=self.get_markers_with_counts()))
		return d
	
class Scene(BaseNamed):
	"""
	Not used anywhere yet, but a stub for the new storytelling interface (where
	each view could be a collection of ordered scenes, configured by the user).
	"""
	extents = models.PolygonField(null=True, blank=True)
	view = models.ForeignKey('View')
	
	