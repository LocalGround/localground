from localground.apps.site.api.serializers.base_serializer import \
    BaseSerializer
from localground.apps.site.api.serializers.field_serializer import \
    FieldSerializerSimple
from localground.apps.site.api.serializers.dataset_serializer import \
    DatasetSerializerDetail
from rest_framework import serializers, exceptions
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from localground.apps.site.models.symbol import Symbol
from localground.apps.site.models.field import Field
from localground.apps.site.models.dataset import Dataset
from django.conf import settings
from rest_framework.fields import empty
import json


class FieldField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        if self.root.instance and data:
            for field in self.root.instance.dataset.fields:
                if field.col_name_db == data:
                    return field
        return self.root.instance.display_field

    def to_representation(self, obj):
        return getattr(obj, 'col_name')


class GroupByField(serializers.CharField):

    def to_internal_value(self, group_by):
        if group_by in ['uniform', 'individual']:
            return group_by

        if self.root.instance:
            dataset_id = self.root.instance.dataset.id
        else:
            dataset_id = data.get('dataset').get('id')
        field = Field.get_field_by_col_name(
            dataset_id, group_by
        )
        if field is None:
            raise exceptions.ValidationError(
                'The field "{0}" could not be found.'.format(
                    group_by
                )
            )
        return field.col_name_db

    def to_representation(self, group_by):
        if group_by in ['uniform', 'individual']:
            return group_by
        try:
            field = Field.get_field_by_unique_key(group_by)
            return field.col_name
        except Exception:
            print(group_by + ' not found')
            return group_by


class LayerSerializer(BaseSerializer):
    create_new_dataset = serializers.BooleanField(
        required=False, write_only=True)
    symbols = fields.SymbolsField(required=False, read_only=True)
    metadata = fields.JSONField(required=False, read_only=True)
    display_field = serializers.SerializerMethodField()
    group_by = GroupByField()
    map_id = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    dataset = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.Layer
        read_only_fields = (
            'ordering', 'group_by', 'symbols', 'metadata', 'dataset')
        fields = BaseSerializer.field_list + (
            'title', 'dataset', 'create_new_dataset',
            'group_by', 'display_field', 'ordering', 'map_id', 'symbols',
            'metadata', 'url'
        )
        depth = 0

    def get_fields(self, *args, **kwargs):
        fields = super(LayerSerializer, self).get_fields(*args, **kwargs)
        # restrict project list at runtime:
        if not self.context.get('view'):
            return fields

        # filter possible datasets and possible views:
        map_id = self.context.get('view').kwargs.get('map_id')
        layer_id = self.context.get('view').kwargs.get('pk')
        project = models.StyledMap.objects.get(id=map_id).project
        if fields.get('dataset'):
            fields['dataset'].queryset = models.Dataset.objects.filter(
                project=project
            )
        if layer_id:
            try:
                layer = models.Layer.objects.get(id=layer_id)
                fields['display_field'].queryset = models.Field.objects.filter(
                    dataset=layer.dataset)
            except Exception:
                pass
        return fields

    def get_map_id(self, obj):
        return obj.styled_map.id

    def get_display_field(self, obj):
        return obj.display_field.col_name

    def _get_serialized_display_field(self, data):
        # A hack to support users to set the display field using col_name
        if self.instance:
            dataset_id = self.instance.dataset.id
        else:
            dataset_id = data.get('dataset').get('id')
        field = Field.get_field_by_col_name(
            dataset_id, data.get('display_field')
        )
        if field is None:
            raise exceptions.ValidationError(
                'The field "{0}" could not be found.'.format(
                    data.get('display_field')
                )
            )
        return field.col_name_db

    def run_validation(self, data=empty):
        # A hack to support users to set the display field using col_name
        if isinstance(data, dict) and data.get('display_field'):
            data['display_field'] = self._get_serialized_display_field(data)
        return super(LayerSerializer, self).run_validation(data=data)

    def get_dataset(self, obj):
        return {
            'id': obj.dataset.id,
            'overlay_type': 'dataset_{0}'.format(obj.dataset.id),
            'name': obj.dataset.name,
            'fields': FieldSerializerSimple(
                obj.dataset.fields, many=True, context={'request': {}}
            ).data
        }

    def get_url(self, obj):
        return '%s/api/0/maps/%s/layers/%s' % \
                (settings.SERVER_URL, obj.styled_map.id, obj.id)

    def create(self, validated_data):
        '''
        Either:
            1. the user opts to create a new dataset, or
            2. the user specifies an existing dataset
        '''
        create_new_dataset = validated_data.pop('create_new_dataset', False)
        dataset = validated_data.get('dataset')
        if not create_new_dataset and dataset is None:
            msg = 'Either create_new_dataset should be set to True '
            msg += 'or a valid dataset should be specified.'
            raise serializers.ValidationError(msg)

        map_id = self.context.get('view').kwargs.get('map_id')
        map = models.StyledMap.objects.get(id=int(map_id))
        validated_data.update({
            'group_by': 'uniform',
            'ordering': len(map.layers) + 1,
            'styled_map': map,
            'symbols': [
                Symbol.SIMPLE.to_dict()
            ]
        })
        validated_data.update(self.get_presave_create_dictionary())

        if create_new_dataset:
            # This custom "create" method will create a dataset if
            # not specified:
            validated_data.update({
                'project': map.project
            })
            if dataset:
                validated_data.pop('dataset')
            self.instance = models.Layer.create(**validated_data)
        else:
            validated_data.update({
                'display_field': dataset.fields[0]
            })
            self.instance = self.Meta.model.objects.create(**validated_data)
            metadata = json.loads(self.instance.metadata)
            metadata['fillColor'] = self.instance.symbols[0]['fillColor']
            metadata['shape'] = self.instance.symbols[0]['shape']
            self.instance.metadata = json.dumps(metadata)
            self.instance.save()
        return self.instance


class LayerSerializerPost(LayerSerializer):
    group_by = GroupByField(required=False, read_only=True)
    dataset = serializers.PrimaryKeyRelatedField(
        queryset=models.Dataset.objects.all(),
        allow_null=True, required=False)

    class Meta:
        model = models.Layer
        read_only_fields = ('ordering', 'group_by', 'symbols', 'metadata')
        fields = BaseSerializer.field_list + (
            'title', 'dataset', 'create_new_dataset',
            'group_by', 'display_field', 'ordering', 'map_id', 'symbols',
            'metadata', 'url'
        )
        depth = 0


class LayerDetailSerializer(LayerSerializer):
    symbols = fields.SymbolsField(
        style={'base_template': 'json.html', 'rows': 5},
        required=True)
    metadata = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5},
        required=True)
    display_field = FieldField(
        queryset=models.Field.objects.all(),
        slug_field='col_name_db'
    )

    class Meta:
        model = models.Layer
        fields = BaseSerializer.field_list + (
            'title', 'group_by', 'display_field', 'dataset',
            'ordering', 'metadata', 'map_id', 'symbols'
        )
        depth = 0

    def update(self, instance, validated_data):
        map_id = self.context.get('view').kwargs.get('map_id')
        validated_data.update({
            'styled_map_id': map_id
        })
        return super(LayerDetailSerializer, self).update(
            instance, validated_data)
