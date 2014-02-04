from rest_framework import viewsets
from localground.apps.site.api import serializers, filters
from rest_framework import generics
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate

class AudioList(generics.ListCreateAPIView, AuditCreate):
	serializer_class = serializers.AudioSerializer
	filter_backends = (filters.SQLFilterBackend,)
	
	def get_queryset(self):
		if self.request.user.is_authenticated():
			return models.Audio.objects.get_objects(self.request.user)
		else:
			return models.Audio.objects.get_objects_public(
				access_key=self.request.GET.get('access_key')
			)
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)
		
		#save uploaded image to file system
		f = self.request.FILES['file_name_orig']
		project = models.Project.objects.get(id=self.request.DATA.get('project_id'))
		obj.save_upload(f, self.request.user, project, do_save=False)
	
		
class AudioInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
	queryset = models.Audio.objects.select_related('owner').all()
	serializer_class = serializers.AudioSerializer
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		