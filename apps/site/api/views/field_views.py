from rest_framework import generics, exceptions
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import QueryableListCreateAPIView
from localground.apps.site import models
from django.http import Http404

class FieldList(QueryableListCreateAPIView):
    serializer_class = serializers.FieldSerializer
    filter_backends = (filters.SQLFilterBackend,)
    model = models.Field

    def get_queryset(self):
        return self.get_form().fields
           
    def perform_create(self, serializer):
        form = self.get_form()
        data = serializer.validated_data
        for f in form.fields:
            if f.col_alias.lower() == data.get('col_alias').lower():
                raise exceptions.ParseError(
                    'There is already a form field called "%s"' % data.get('col_alias'))
        instance = serializer.save(form=form)
    
    def get_form(self):
        try:
            form = models.Form.objects.get(id=self.kwargs.get('form_id'))
            return form
        except models.Form.DoesNotExist:
            raise Http404
        
class FieldInstance(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.FieldSerializerUpdate
    filter_backends = (filters.SQLFilterBackend,)
    
    def get_queryset(self):
        return models.Field.objects.all()

    def get_form(self):
        try:
            form = models.Form.objects.get(id=self.kwargs.get('form_id'))
            return form
        except models.Form.DoesNotExist:
            raise Http404
    
    def perform_update(self, serializer):
        # Todo: move functionality to Serializer
        form = self.get_form()
        data = serializer.validated_data
        for f in form.fields:
            if f.col_alias.lower() == data.get('col_alias').lower() and f.id != int(self.kwargs.get('pk')):
                raise exceptions.ParseError(
                    'There is already a form field called "%s"' % data.get('col_alias'))
        serializer.save()
