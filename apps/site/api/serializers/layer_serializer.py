from localground.apps.site.api.serializers.base_serializer import \
    BaseSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields


class LayerSerializer(BaseSerializer):
    symbols = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5}, required=False)
    metadata = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5}, required=False)
    display_field = serializers.SerializerMethodField()
    map_id = serializers.SerializerMethodField()
    data_source = serializers.SerializerMethodField()
    dataset = serializers.PrimaryKeyRelatedField(
        queryset=models.Form.objects.all())

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
        return obj.display_field.col_name

    def create(self, validated_data):
        map_id = self.context.get('view').kwargs.get('map_id')
        validated_data.update({
            'styled_map_id': map_id
        })
        form = models.Form.objects.get(id=validated_data.get('dataset').id)
        validated_data['display_field'] = form.fields[0]
        validated_data.update(self.get_presave_create_dictionary())
        self.instance = self.Meta.model.objects.create(**validated_data)
        return self.instance

    class Meta:
        model = models.Layer
        fields = BaseSerializer.field_list + (
            'title', 'dataset', 'data_source', 'group_by', 'display_field',
            'ordering', 'metadata', 'map_id', 'symbols'
        )
        depth = 0


class LayerDetailSerializer(LayerSerializer):
    display_field = serializers.PrimaryKeyRelatedField(
        queryset=models.Field.objects.all())

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
