from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from localground.apps.site.api import filters
from localground.apps.site.models import Project
from rest_framework import generics, status, exceptions

class AuditCreate(object):
	
	def pre_save(self, obj):
		'''
		For database inserts
		'''
		obj.owner = self.request.user
		obj.last_updated_by = self.request.user
		obj.timestamp = get_timestamp_no_milliseconds()
		
	def metadata(self, request):
		"""
		Return a dictionary of metadata about the view.
		Used to return responses for OPTIONS requests.
		"""

		# This is used by ViewSets to disambiguate instance vs list views
		view_name_suffix = getattr(self, 'suffix', None)

		# By default we can't provide any form-like information, however the
		# generic views override this implementation and add additional
		# information for POST and PUT methods, based on the serializer.
		from django.utils.datastructures import SortedDict
		ret = SortedDict()
		ret['name'] = get_view_name(self.__class__, view_name_suffix)
		ret['description'] = get_view_description(self.__class__)
		ret['renders'] = [renderer.media_type for renderer in self.renderer_classes]
		ret['parses'] = [parser.media_type for parser in self.parser_classes]
		return ret
		
class AuditUpdate(AuditCreate):
	def pre_save(self, obj):
		'''
		For database updates
		'''
		obj.last_updated_by = self.request.user
		obj.timestamp = get_timestamp_no_milliseconds()
		

class MediaList(generics.ListCreateAPIView, AuditCreate):
	filter_backends = (filters.SQLFilterBackend,)
	ext_whitelist = []
	
	def get_queryset(self):
		if self.request.user.is_authenticated():
			return self.model.objects.get_objects(self.request.user)
		else:
			return self.model.objects.get_objects_public(
				access_key=self.request.GET.get('access_key')
			)
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)
		
		#save uploaded image to file system
		f = self.request.FILES['file_name_orig']
		if f:
			# ensure filetype is valid:
			import os
			ext = os.path.splitext(f.name)[1]
			ext = ext.lower().replace('.', '')
			if ext not in self.ext_whitelist:
				raise exceptions.UnsupportedMediaType(f,
					'{0} is not a valid {1} file type. Valid options are: {2}'
						.format(
							ext, self.model.model_name, self.ext_whitelist
						)
				)
			project_id = self.request.DATA.get('project_id')
			project = Project.objects.get(id=project_id)
			if not project.can_edit(self.request.user):
				raise exceptions.PermissionDenied(
					detail='You do not have edit access to the project #{0}'.format(project_id))	
			obj.save_upload(f, self.request.user, project, do_save=False)

class MediaInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
	
	def get_queryset(self):
		return self.model.objects.select_related('owner').all()
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
	