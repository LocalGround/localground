from rest_framework import generics, exceptions
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import QueryableListCreateAPIView
from localground.apps.site import models
from django.http import Http404

class FieldMixin(object):

    def get_form(self):
        try:
            form = models.Form.objects.get(id=self.kwargs.get('form_id'))
            return form
        except models.Form.DoesNotExist:
            raise Http404
    
    def update_ordering_and_display_field(self, instance, form):
        ordering = instance.ordering
        new_order = 1
        fields = []
        for field in form.fields:
            if field.id != instance.id:
                fields.append(field)
        fields.insert(ordering - 1, instance)
        for field in fields:
            has_changed = False
            if field.ordering != new_order:
                has_changed = True
                field.ordering = new_order
            if instance.is_display_field and field.is_display_field and \
                field.id != instance.id:
                field.is_display_field = False
                has_changed = True
            if has_changed:
                field.save()
            new_order += 1
            
    def validate_ordering_value(self, ordering, form):
        max_val = len(form.fields)
        if ordering < 1 or ordering > max_val:
             raise exceptions.ParseError(
                    'Your ordering must be an integer between 1 and %s' % max_val)
    

class FieldList(FieldMixin, QueryableListCreateAPIView):
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
        self.validate_ordering_value(data.get('ordering'), form)
        instance = serializer.save(form=form)
        self.update_ordering_and_display_field(instance, form)
        
class FieldInstance(FieldMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.FieldSerializerUpdate
    filter_backends = (filters.SQLFilterBackend,)
    
    def get_queryset(self):
        return models.Field.objects.all()

    def perform_update(self, serializer):
        # Todo: move functionality to Serializer
        form = self.get_form()
        data = serializer.validated_data
        #raise Exception(data)
        for f in form.fields:
            if f.col_alias.lower() == data.get('col_alias').lower() and f.id != int(self.kwargs.get('pk')):
                raise exceptions.ParseError(
                    'There is already a form field called "%s"' % data.get('col_alias'))
        
        self.validate_ordering_value(data.get('ordering'), form)
        instance = serializer.save()
        self.update_ordering_and_display_field(instance, form)
