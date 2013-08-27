from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate
from localground.apps.site import models

class MarkerList(generics.ListCreateAPIView, AuditCreate):
	serializer_class = serializers.MarkerSerializerCounts
	filter_backends = (filters.SQLFilterBackend,)

	paginate_by = 100
	
	def get_queryset(self):
		return models.Marker.objects.get_objects_with_counts(self.request.user)
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)
		  
		
class MarkerInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
	queryset = models.Marker.objects.select_related('owner', 'project')
	serializer_class = serializers.MarkerSerializer
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)