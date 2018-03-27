from localground.apps.site.api.serializers.base_serializer import \
    BaseNamedSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from localground.apps.site.api.serializers.layer_serializer import \
    LayerSerializer


class MapSerializer(BaseNamedSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='map-detail',)
    sharing_url = serializers.SerializerMethodField()
    center = fields.GeometryField(
                help_text='Assign a GeoJSON string',
                required=True,
                style={'base_template': 'json.html', 'rows': 5}
            )
    panel_styles = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5}, required=False)
    basemap = serializers.PrimaryKeyRelatedField(
        queryset=models.TileSet.objects.all())
    zoom = serializers.IntegerField(min_value=1, max_value=20, default=17)
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Project.objects.all(),
        source='project',
        required=False
    )
    create_new_dataset = serializers.BooleanField(
        required=False, write_only=True)
    data_sources = fields.JSONField(
        required=False, write_only=True,
        style={'base_template': 'json.html', 'rows': 5})

    def get_sharing_url(self, obj):
        return obj.slug

    def get_datasets(self, data_sources, project_id):
        datasets = []
        if len(data_sources) == 0:
            raise serializers.ValidationError('At least one data source should be specified in the data_sources array')
        for data_source in data_sources:
            try:
                form_id = int(data_source.split('_')[1])
                form = models.Form.objects.get(id=form_id)
                datasets.append(form)
                print(form)
            except Exception:
                raise serializers.ValidationError(
                    '{0} is not a valid dataset'.format(data_source))
        return datasets

    def create(self, validated_data):
        '''
        Either:
            1. the user opts to create a new dataset, or
            2. the user passes in a list of existing data sources

        TODO: if a datasource is deleted but there are layers that link to the
        datasource, throw an exception from the API that lists the maps that
        are dependent on the datasource.
        '''
        create_new_dataset = validated_data.pop('create_new_dataset', False)
        data_sources = validated_data.pop('data_sources', None)

        if not create_new_dataset and data_sources is None:
            msg = 'Either create_new_dataset should be set to True '
            msg += 'or data_sources should contain a list of valid dataset IDs'
            raise serializers.ValidationError(msg)

        import uuid
        validated_data['slug'] = uuid.uuid4().hex
        validated_data.update(self.get_presave_create_dictionary())
        if validated_data.get('panel_styles') is None:
            validated_data['panel_styles'] = \
                models.StyledMap.default_panel_styles
        self.instance = self.Meta.model.objects.create(**validated_data)

        layers = []
        if data_sources:
            project_id = validated_data.get('project_id')
            datasets = self.get_datasets(data_sources, project_id)
            for dataset in datasets:
                layer = models.Layer.create(
                    last_updated_by=validated_data.get('last_updated_by'),
                    owner=validated_data.get('owner'),
                    styled_map=self.instance,
                    project=self.instance.project,
                    dataset=dataset
                )
                layers.append(layer)
        else:
            layer = models.Layer.create(
                last_updated_by=validated_data.get('last_updated_by'),
                owner=validated_data.get('owner'),
                styled_map=self.instance,
                project=self.instance.project
            )
            layers.append(layer)
        return self.instance

    '''
    def get_fields(self, *args, **kwargs):
        fields = super(MapSerializer, self).get_fields(*args, **kwargs)
        # restrict project list at runtime:
        fields['project_id'].queryset = self.get_projects()
        return fields
    '''

    class Meta:
        model = models.StyledMap
        fields = BaseNamedSerializer.Meta.fields + (
            'sharing_url', 'center', 'basemap', 'zoom',
            'panel_styles', 'project_id', 'create_new_dataset', 'data_sources')
        depth = 0


class MapDetailSerializer(MapSerializer):
    layers = serializers.SerializerMethodField()
    layers_url = serializers.SerializerMethodField()

    class Meta:
        model = models.StyledMap
        fields = MapSerializer.Meta.fields + ('layers', 'layers_url')
        depth = 0

    def get_layers(self, obj):
        layers = models.Layer.objects.filter(styled_map=obj)
        return LayerSerializer(layers, many=True, context={'request': {}}).data

    def get_layers_url(self, obj):
        return '%s/api/0/maps/%s/layers/' % (settings.SERVER_URL, obj.id)


class MapDetailSerializerSlug(MapDetailSerializer):
    extra_kwargs = {
        'url': {'lookup_field': 'slug'}
    }
