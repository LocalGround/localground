from django.contrib.gis.db import models
from localground.apps.site.models import BaseAudit
from datetime import datetime
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from jsonfield import JSONField
from localground.apps.site.models import DataType, Layer
from rest_framework import exceptions


class Field(BaseAudit):
    dataset = models.ForeignKey('Dataset', on_delete=models.CASCADE)
    col_name_db = models.CharField(max_length=255, db_column="col_name")
    col_alias = models.CharField(max_length=255, verbose_name="column name")
    data_type = models.ForeignKey('DataType', on_delete=models.PROTECT)
    extras = JSONField(blank=True, null=True)
    ordering = models.IntegerField()

    def can_view(self, user=None, access_key=None):
        return self.dataset.can_view(user=user, access_key=access_key)

    def can_edit(self, user):
        return self.dataset.can_edit(user)

    def can_manage(self, user):
        return self.dataset.can_manage(user)

    def to_dict(self):
        return dict(alias=self.col_alias, id=self.id)

    def __unicode__(self):
        return '{0}. {1}'.format(self.id, self.col_alias)

    def __str__(self):
        return self.col_alias

    def toJSON(self):
        return {
            'id': self.id,
            'ordering': self.ordering,
            'col_alias': self.col_alias,
            'col_name': self.col_name
        }

    @property
    def col_name(self):
        import re
        # strip non-alpha-numeric characters (except spaces and dashes):
        tmp = re.sub(r'([^-^\s\w]|_)+', '', self.col_alias)

        # replace spaces and dashes with underscores:
        return str(re.sub(r'([-\s])+', '_', tmp).lower())

    @property
    def unique_key(self):
        return 'field_{0}'.format(self.id)

    @classmethod
    def get_field_by_unique_key(cls, unique_key):
        try:
            return cls.objects.filter(col_name_db=unique_key)[0]
        except Exception:
            raise Exception(
                'The field "{0}" could not be found.'.format(unique_key)
            )

    @classmethod
    def get_field_by_col_name(cls, dataset_id, col_name):
        from localground.apps.site.models import Dataset
        fields = Dataset.objects.get(id=dataset_id).fields
        for field in fields:
            if field.col_name == col_name:
                return field
        return None

    class Meta:
        app_label = 'site'
        verbose_name = 'field'
        verbose_name_plural = 'fields'
        ordering = ['dataset__id', 'ordering']
        unique_together = (
            ('col_alias', 'dataset'), ('col_name_db', 'dataset'))

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        # 1. ensure that user doesn't inadvertently change the data type of the
        # column
        if is_new:
            import random
            random_string = ''.join(
                random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 8))
            self.date_created = get_timestamp_no_milliseconds()
            self.col_name_db = 'col_placeholder_' + random_string
        else:
            o = Field.objects.get(id=self.id)
            if o.data_type != self.data_type:
                raise Exception(
                    'You are not allowed to change the field type of an ' +
                    'existing field')

        self.time_stamp = get_timestamp_no_milliseconds()
        super(Field, self).save(*args, **kwargs)

        # 2. ensure that the column name is unique, and add column to table:
        self.col_name_db = self.unique_key
        super(Field, self).save(update_fields=['col_name_db'])

    def _output_dependency(self, layer):
        return '{0} > {1} > {2}'.format(
            layer.styled_map.project.name,
            layer.styled_map.name,
            layer.title
        )

    def _get_display_field_dependencies(self):
        layers = Layer.objects.filter(
            display_field=self)
        return [self._output_dependency(layer) for layer in layers]

    def _get_symbol_dependencies(self):
        maps = []
        layers = Layer.objects.filter(
            styled_map__project=self.dataset.project)
        for layer in layers:
            for symbol in layer.symbols:
                if symbol['rule'].find(self.col_name_db) != -1:
                    maps.append(self._output_dependency(layer))
                    break
        return list(set(maps))

    def _throw_error_if_only_one_field(self):
        if len(self.dataset.fields) == 1:
            raise exceptions.ValidationError(
                'Error: This dataset must contain at least 1 field')

    def _throw_error_if_map_layer_dependencies(self):
        # Ensure that dataset is not deleted if there are layers linking to it:
        display_field_errors = self._get_display_field_dependencies()
        map_symbol_dependency_errors = self._get_symbol_dependencies()
        if display_field_errors or map_symbol_dependency_errors:
            general_error = 'This field cannot be deleted because '
            general_error += 'dependencies have been detected.'
            messages = {
                'error_message': general_error,
                'dependencies':
                    display_field_errors + map_symbol_dependency_errors
            }
            raise exceptions.ValidationError(messages)

    def _reorder_siblings_on_delete(self):
        # splice model from list:
        fields = list(self.dataset.fields)
        current_index = fields.index(self)
        fields.pop(current_index)

        # commit re-ordered values to database:
        counter = 1
        for model in fields:
            model.ordering = counter
            model.save()
            counter += 1

    def delete(self, **kwargs):
        self._throw_error_if_only_one_field()
        self._throw_error_if_map_layer_dependencies()
        self._reorder_siblings_on_delete()
        super(Field, self).delete(**kwargs)
