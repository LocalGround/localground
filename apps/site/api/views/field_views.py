from rest_framework import generics, exceptions
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    AuditCreate, AuditUpdate, QueryableListCreateAPIView
from localground.apps.site import models
from django.http import Http404

class FieldList(QueryableListCreateAPIView, AuditCreate):
    queryset = models.Field.objects.all()
    serializer_class = serializers.FieldSerializer
    filter_backends = (filters.SQLFilterBackend,)

    def get_queryset(self):
        return self.get_form().fields
        
    def pre_save(self, obj):
        obj.form = self.get_form()
        AuditCreate.pre_save(self, obj)
        
    def get_form(self):
        try:
            form = models.Form.objects.get(id=self.kwargs.get('form_id'))
            return form
        except models.Form.DoesNotExist:
            raise Http404
    
        
        
        
    def post_save(self, obj, created=False):
        # if the field is renamed, the parent form's cached TableModel
        # needs to be cleared so that a new TableModel definition can be
        # instantiated in memory:
        #obj.col_name_db = 'col_%s' % self.pk
        #obj.save()
        obj.form.clear_table_model_cache()
        
class FieldInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
    serializer_class = serializers.FieldSerializerUpdate
    filter_backends = (filters.SQLFilterBackend,)
    
    def get_queryset(self):
        return models.Field.objects.all()

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
        