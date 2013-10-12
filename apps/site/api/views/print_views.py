from rest_framework import viewsets, generics, permissions
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate
from localground.apps.site import models

class PrintList(generics.ListCreateAPIView, AuditCreate):
	serializer_class = serializers.PrintSerializer
	filter_backends = (filters.SQLFilterBackend,)
	model = models.Print
	
	def get_queryset(self):
		if self.request.user.is_authenticated():
			return models.Print.objects.get_objects(self.request.user)
		else:
			return models.Print.objects.get_objects_public(
				access_key=self.request.GET.get('access_key')
			)

	paginate_by = 100
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)		
		p = models.Print.insert_print_record(
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
			do_save=False
		)
		p.generate_pdf(has_extra_form_page=False)
		#copy data from unsaved print object into API object
		#(this may be unsafe):
		for f in p._meta.fields:
			obj.__dict__[f.name] = getattr(p, f.name)
		
class PrintInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
	queryset = models.Print.objects.select_related('project', 'layout', 'map_provider').all()
	serializer_class = serializers.PrintSerializerDetail
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		
class LayoutViewSet(viewsets.ModelViewSet, AuditUpdate):
	queryset = models.Layout.objects.all()
	serializer_class = serializers.LayoutSerializer
	permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
	filter_backends = (filters.SQLFilterBackend,)
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
