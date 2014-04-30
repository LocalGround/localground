from rest_framework import generics, status
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
	AuditCreate, AuditUpdate, QueryableListCreateAPIView
from localground.apps.site import models
from localground.apps.site.api.permissions import CheckProjectPermissions
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.http import HttpResponse

class ViewMixin(object):
	
	def post_save(self, obj, created=False):
		'''
		Saves all children:
		'''
		from localground.apps.lib.helpers import get_timestamp_no_milliseconds
		import json
		from django.db import connection, IntegrityError, DatabaseError
		entities = self.request.DATA.get('entities')
		if entities:
			try:
				entities = json.loads(entities)
			except ValueError:
				raise ValidationError('Error parsing JSON')
			source_type = self.model.get_content_type()
			source_id = obj.id
			#1) delete all generic associations that are associated with 
			#	this particular view:
			obj.entities.all().delete()
			
			#2) attach child media:
			for child in entities:
				#raise Exception(child)
				overlay_type = child.get('overlay_type')
				entity_id = child.get('id')
				entity_type = models.Base.get_model(
								model_name=overlay_type
							).get_content_type()
				a = models.GenericAssociation(
					source_id=source_id,
					source_type=source_type,
					entity_id=entity_id,
					entity_type=entity_type
				)
				a.owner = self.request.user
				a.last_updated_by = self.request.user
				a.time_stamp = get_timestamp_no_milliseconds()
				
				try:
					a.save()
				except IntegrityError, e:
					self.warnings.append('duplicates removed')
					connection._rollback()
			
	
				
class ViewList(QueryableListCreateAPIView, ViewMixin, AuditCreate):
	error_messages = {}
	warnings = []
	serializer_class = serializers.ViewSerializer
	filter_backends = (filters.SQLFilterBackend,)
	model = models.View
	paginate_by = 100
	
	def get_queryset(self):
		if self.request.user.is_authenticated():
			return self.model.objects.get_objects(self.request.user)
		else:
			return self.model.objects.get_objects_public(
				access_key=self.request.GET.get('access_key')
			)
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)
		obj.access_authority = models.ObjectAuthority.objects.get(id=1)
		
	def post_save(self, obj, created=False):
		ViewMixin.post_save(self, obj, created=False)
		
	def create(self, request, *args, **kwargs):
		response = super(ViewList, self).create(request, *args, **kwargs)
		if len(self.warnings) > 0:
			response.data.update({'warnings': self.warnings})
		if self.error_messages:
			response.data = self.error_messages
			response.status = status.HTTP_400_BAD_REQUEST
		return response
		
	
class ViewInstance(generics.RetrieveUpdateDestroyAPIView, ViewMixin, AuditUpdate):
	error_messages = {}
	warnings = []
	queryset = models.View.objects.select_related('owner').all()
	serializer_class = serializers.ViewDetailSerializer
	model = models.View
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		
	def post_save(self, obj, created=False):
		ViewMixin.post_save(self, obj, created=False)
		
	def update(self, request, *args, **kwargs):
		response = super(ViewInstance, self).update(request, *args, **kwargs)
		if len(self.warnings) > 0:
			response.data.update({'warnings': self.warnings})
		if self.error_messages:
			response.data = self.error_messages
			response.status = status.HTTP_400_BAD_REQUEST
		return response
	