from rest_framework import viewsets, generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate
from localground.apps.site import models

class FormList(generics.ListCreateAPIView, AuditCreate):
	serializer_class = serializers.FormSerializer
	filter_backends = (filters.SQLFilterBackend,)
	queryset = models.Form.objects.select_related('owner')

	paginate_by = 100
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)
		
class FormInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
	queryset = models.Form.objects.select_related('owner')
	serializer_class = serializers.FormSerializer
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		
class DataTypeViewSet(viewsets.ModelViewSet, AuditUpdate):
	queryset = models.DataType.objects.all().order_by('name',)
	serializer_class = serializers.DataTypeSerializer
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		