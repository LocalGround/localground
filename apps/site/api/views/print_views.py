from rest_framework import viewsets, generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate
from localground.apps.site import models

class PrintList(generics.ListCreateAPIView, AuditCreate):
	serializer_class = serializers.PrintSerializer
	filter_backends = (filters.SQLFilterBackend,)
	queryset = models.Print.objects.select_related('project', 'owner')

	paginate_by = 100
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)
		p = models.Print.generate_print(
			self.request.user,
			obj.project,
			obj.layout,
			obj.map_provider,
			obj.zoom,
			obj.center,
			self.request.get_host(),
			map_title=obj.name,
			instructions=obj.description,
			form=None,
			layer_ids=None,
			scan_ids=None,
			has_extra_form_page=False,
			do_save=False
		)
		#copy data from unsaved print object into API object
		#(this may be unsafe):
		for f in p._meta.fields:
			obj.__dict__[f.name] = getattr(p, f.name)
			
		'''
		obj.uuid = p.uuid
		obj.extents = p.extents
		obj.northeast = p.northeast
		obj.southwest = p.southwest
		obj.virtual_path = p.virtual_path
		obj.host = p.host
		obj.map_image_path = p.map_image_path 
		obj.pdf_path = p.pdf_path
		obj.preview_image_path = p.preview_image_path
		obj.map_width = p.map_width
		obj.map_height = p.map_height
		'''
		
class PrintInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
	queryset = models.Print.objects.select_related('project', 'layout', 'map_provider').all()
	serializer_class = serializers.PrintSerializerDetail
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		
class LayoutViewSet(viewsets.ModelViewSet, AuditUpdate):
	queryset = models.Layout.objects.all()
	serializer_class = serializers.LayoutSerializer
	filter_backends = (filters.SQLFilterBackend,)
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
