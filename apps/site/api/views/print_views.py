from rest_framework import viewsets, generics, permissions
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    AuditCreate, AuditUpdate, QueryableListCreateAPIView
from localground.apps.site import models


class PrintList(QueryableListCreateAPIView, AuditCreate):
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
    
    def perform_create(self, serializer):
        posted_data = serializer.validated_data
        d = self.get_presave_dictionary()
        # Do some extra work to generate the PDF and calculate the map extents:
        instance = models.Print.insert_print_record(
            self.request.user,
            posted_data.get('project'),
            posted_data.get('layout'),
            posted_data.get('map_provider'),
            posted_data.get('zoom'),
            posted_data.get('center'),
            self.request.get_host(),
            map_title=posted_data.get('name'),
            instructions=posted_data.get('description'),
            do_save=False
        )
        instance.generate_pdf(has_extra_form_page=False)
        d.update({
            'northeast': instance.northeast,
            'southwest': instance.southwest,
            'extents': instance.extents,
            'host': instance.host,
            'map_image_path': instance.map_image_path,
            'pdf_path': instance.pdf_path,
            'preview_image_path': instance.preview_image_path,
            'map_image_path': instance.map_image_path,
            'map_width': instance.map_width,
            'map_height': instance.map_height
        })
        serializer.save(**d)

class PrintInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
    queryset = models.Print.objects.select_related(
        'project',
        'layout',
        'map_provider').all()
    serializer_class = serializers.PrintSerializerDetail

    def perform_update(self, serializer):
        AuditUpdate.perform_update(self, serializer)


class LayoutViewSet(viewsets.ModelViewSet, AuditUpdate):
    queryset = models.Layout.objects.all()
    serializer_class = serializers.LayoutSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    filter_backends = (filters.SQLFilterBackend,)

    def perform_update(self, serializer):
        AuditUpdate.perform_update(self, serializer)
