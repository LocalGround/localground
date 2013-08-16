from rest_framework import generics, viewsets
from localground.apps.site.api import serializers
from localground.apps.site.api.views.abstract_views import AuditUpdate
from localground.apps.site import models
from localground.apps.site.api.filters import SQLFilterBackend

class ScanViewSet(viewsets.ModelViewSet, AuditUpdate):
	"""
	This viewset automatically provides `list`, `create`, `retrieve`,
	`update` and `destroy` actions.

	Additionally we also provide an extra `highlight` action. 
	"""
	queryset = models.Scan.objects.select_related('project', 'owner', 'processed_image').all()
	serializer_class = serializers.ScanSerializer
	filter_backends = (SQLFilterBackend,)
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)