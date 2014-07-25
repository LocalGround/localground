from rest_framework import generics, exceptions
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    AuditCreate, AuditUpdate, QueryableListCreateAPIView
from localground.apps.site import models

class FieldList(QueryableListCreateAPIView, AuditCreate):
    queryset = models.Field.objects.all()
    serializer_class = serializers.FieldSerializer
    filter_backends = (filters.SQLFilterBackend,)

    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)
        
class FieldInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
    queryset = models.Field.objects.all()
    serializer_class = serializers.FieldSerializer
    filter_backends = (filters.SQLFilterBackend,)

    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
        for f in obj.form.fields:
            if f.col_alias.lower() == obj.col_alias.lower() and f.id != obj.id:
                raise exceptions.ParseError(
                    'There is already a form field called "%s"' % obj.col_alias)
            
    def post_save(self, obj, created=False):
        # if the field is renamed, the parent form's cached TableModel
        # needs to be cleared so that a new TableModel definition can be
        # instantiated in memory:
        obj.form.clear_table_model_cache()
        