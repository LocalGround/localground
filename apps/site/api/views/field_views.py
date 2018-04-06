from rest_framework import generics, exceptions
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
from localground.apps.site import models
from django.http import Http404


class FieldMixin(object):

    def get_form(self):
        try:
            form = models.Form.objects.get(id=self.kwargs.get('form_id'))
            return form
        except models.Form.DoesNotExist:
            raise Http404

    def reorder_fields_if_needed(self, form):
        ordering = 1
        for field in form.fields:
            field.ordering = ordering
            field.save()
            ordering += 1

    def update_ordering(self, instance, form):
        ordering = instance.ordering
        new_order = 1
        fields = []
        for field in form.fields:
            if field.id != instance.id:
                fields.append(field)
        fields.insert(ordering - 1, instance)
        for field in fields:
            if field.ordering != new_order:
                field.ordering = new_order
                field.save()
            new_order += 1

    def validate_is_valid_col_alias(self, col_alias, form, pk=None):
        # if doesn't exist, no need to validate:
        if not col_alias:
            return

        col_alias = col_alias.lower()
        # ensure that col_alias isn't a reserved name:
        if col_alias in [
            'id', 'caption', 'display_name', 'tags',
                'owner', 'last_updated_by', 'date_created', 'timestamp']:
            raise exceptions.ParseError(
                '"%s" is a reserved column name' % col_alias)
        # ensure that it doesn't already exist:
        for f in form.fields:
            if f.col_alias.lower() == col_alias and f.id != pk:
                raise exceptions.ParseError(
                    'There is already a form field called "%s"' % col_alias)

    def validate_ordering_value(self, ordering, form, is_create=False):
        # Am pretty sure this is more trouble than it's worth
        # no validation needed if ordering is undefined:
        if ordering is None:
            return

        # ensure that ordering value makes sense
        # (between 1 and the total # of fields):
        max_val = len(form.fields)
        if is_create:
            max_val += 1
        elif ordering < 1 or ordering > max_val:
            # only raise an exception on update:
            raise exceptions.ParseError(
                'Your ordering must be an integer between 1 and %s' % max_val)


class FieldList(FieldMixin, QueryableListCreateAPIView):
    serializer_class = serializers.FieldSerializer
    filter_backends = (filters.SQLFilterBackend,)
    model = models.Field

    def get_queryset(self):
        return self.get_form().fields

    def perform_create(self, serializer):
        do_reshuffle = self.request.data.get('do_reshuffle')
        form = self.get_form()
        data = serializer.validated_data
        self.validate_is_valid_col_alias(data.get('col_alias'), form)
        instance = serializer.save(form=form)
        if do_reshuffle:
            self.update_ordering(instance, form)


class FieldInstance(FieldMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.FieldSerializerUpdate
    filter_backends = (filters.SQLFilterBackend,)

    def get_queryset(self):
        return models.Field.objects.all()

    def perform_update(self, serializer):
        # Todo: move functionality to Serializer
        do_reshuffle = self.request.data.get('do_reshuffle')
        form = self.get_form()
        data = serializer.validated_data
        self.validate_is_valid_col_alias(
            data.get('col_alias'), form, pk=int(self.kwargs.get('pk')))
        instance = serializer.save()
        if do_reshuffle:
            self.update_ordering(instance, form)

    def __throw_error_if_only_one_field(self, instance):
        if len(instance.form.fields) == 1:
            raise exceptions.ParseError(
                'Error: This dataset must contain at least 1 field')

    def __throw_error_if_layer_dependencies(self, instance):
        dependent_layers = models.Layer.objects.values(
            'styled_map__name', 'title').filter(display_field=instance)

        if len(dependent_layers) > 0:
            clashes = []
            for layer in dependent_layers:
                clashes.append('{0}: {1}'.format(
                    layer.get('styled_map__name'), layer.get('title')
                ))
            msg = 'The following map layers display this field: {0}'.format(
                ', '.join(clashes)
            )
            msg += '. Please modify the dependent layers\' display fields '
            msg += 'before deleting this field'
            raise exceptions.ParseError(msg)

    def perform_destroy(self, instance):
        form = instance.form

        # 2 validation checks:
        #   a) make sure that the form keeps at least one field:
        #   b) make sure that if a layer is relying on the field for its
        #      display name, that it shows an error:
        self.__throw_error_if_only_one_field(instance)
        self.__throw_error_if_layer_dependencies(instance)

        # if no errors, destroy field:
        instance.delete()
        self.reorder_fields_if_needed(form)
