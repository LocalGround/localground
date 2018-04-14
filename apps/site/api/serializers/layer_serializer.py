from localground.apps.site.api.serializers.base_serializer import \
    BaseSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings


class LayerSerializer(BaseSerializer):
    create_new_dataset = serializers.BooleanField(
        required=False, write_only=True)
    symbols = fields.JSONField(required=False, read_only=True)
    metadata = fields.JSONField(required=False, read_only=True)
    display_field = serializers.SerializerMethodField()
    map_id = serializers.SerializerMethodField()
    data_source = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    dataset = serializers.PrimaryKeyRelatedField(
        queryset=models.Form.objects.all(),
        allow_null=True)

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
            fields['dataset'].queryset = models.Form.objects.filter(
                project=project
            )
        if layer_id:
            try:
                layer = models.Layer.objects.get(id=layer_id)
                fields['display_field'].queryset = models.Field.objects.filter(
                    form=layer.dataset)
            except Exception:
                pass
        return fields

    def get_map_id(self, obj):
        return obj.styled_map.id

    def get_data_source(self, obj):
        return 'form_{0}'.format(obj.dataset.id)

    def get_display_field(self, obj):
        return obj.display_field.col_name_db

    def get_url(self, obj):
        return '%s/api/0/maps/%s/layers/%s' % \
                (settings.SERVER_URL, obj.styled_map.id, obj.id)

    def create(self, validated_data):
        '''
        Either:
            1. the user opts to create a new dataset, or
            2. the user specifies an existing datasource
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
            'styled_map': map
        })
        validated_data.update(self.get_presave_create_dictionary())

        if create_new_dataset:
            # This custom "create" method will create a dataset if
            # not specified:
            validated_data.update({
                'project': map.project
            })
            self.instance = models.Layer.create(**validated_data)
        else:
            validated_data.update({
                'display_field': dataset.fields[0]
            })
            self.instance = self.Meta.model.objects.create(**validated_data)

        return self.instance

    class Meta:
        model = models.Layer
        read_only_fields = ('ordering', 'group_by', 'symbols', 'metadata')
        fields = BaseSerializer.field_list + (
            'title', 'dataset', 'create_new_dataset', 'data_source',
            'group_by', 'display_field', 'ordering', 'map_id', 'symbols',
            'metadata', 'url'
        )
        depth = 0


class LayerDetailSerializer(LayerSerializer):
    symbols = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5},
        required=True)
    metadata = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5},
        required=True)
    display_field = serializers.SlugRelatedField(
        queryset=models.Field.objects.all(),
        slug_field='col_name_db')

    def update(self, instance, validated_data):
        map_id = self.context.get('view').kwargs.get('map_id')
        validated_data.update({
            'styled_map_id': map_id
        })
        return super(LayerDetailSerializer, self).update(
            instance, validated_data)

    class Meta:
        model = models.Layer
        fields = BaseSerializer.field_list + (
            'title', 'data_source', 'group_by', 'display_field',
            'ordering', 'metadata', 'map_id', 'symbols'
        )
        depth = 0
