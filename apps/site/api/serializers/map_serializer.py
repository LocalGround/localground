from localground.apps.site.api.serializers.base_serializer import \
    NamedSerializerMixin, ProjectSerializerMixin, BaseSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings
from localground.apps.site.api.serializers.layer_serializer import \
    LayerSerializer


class MapSerializerList(
        NamedSerializerMixin, ProjectSerializerMixin, BaseSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='map-detail',)
    sharing_url = serializers.SerializerMethodField()
    # project_id = serializers.SerializerMethodField()
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
    layers = serializers.SerializerMethodField()
    layers_url = serializers.SerializerMethodField()

    field_list = ('sharing_url', 'center',  'basemap', 'zoom', 'project_id')

    def get_sharing_url(self, obj):
        return '{0}/maps/{1}'.format(settings.SERVER_URL, obj.slug)

    def get_layers(self, obj):
        layers = models.Layer.objects.filter(styled_map=obj)
        return LayerSerializer(layers, many=True, context={'request': {}}).data

    def get_layers_url(self, obj):
        return '%s/api/0/maps/%s/layers/' % (settings.SERVER_URL, obj.id)

    class Meta:
        model = models.StyledMap
        fields = BaseSerializer.field_list + \
            NamedSerializerMixin.field_list + \
            ProjectSerializerMixin.field_list + (
                'sharing_url', 'center',  'basemap', 'zoom', 'panel_styles',
                'slug', 'layers', 'layers_url'
            )
        depth = 0


class MapSerializerPost(MapSerializerList):
    create_new_dataset = serializers.BooleanField(
        required=False, write_only=True)
    datasets = fields.JSONField(
        required=False, write_only=True,
        style={'base_template': 'json.html', 'rows': 5})

    layers = serializers.SerializerMethodField()

    def get_layers(self, obj):
        layers = models.Layer.objects.filter(styled_map=obj)
        return LayerSerializer(layers, many=True, context={'request': {}}).data

    class Meta:
        model = models.StyledMap
        fields = BaseSerializer.field_list + \
            NamedSerializerMixin.field_list + \
            ProjectSerializerMixin.field_list + (
                'sharing_url', 'center',  'basemap', 'zoom',
                'create_new_dataset', 'datasets', 'layers')
        depth = 0

    def get_datasets(self, dataset_ids, project_id):
        datasets = []
        if len(dataset_ids) == 0:
            error_message = 'At least one dataset should be specified '
            error_message += 'in the datasets array'
            raise serializers.ValidationError(error_message)
        for dataset_id in dataset_ids:
            try:
                form_id = int(dataset_id)
                form = models.Form.objects.get(id=form_id)
                datasets.append(form)
            except Exception:
                raise serializers.ValidationError(
                    '{0} is not a valid dataset id'.format(dataset_id))
        return datasets

    def create(self, validated_data):
        '''
        Either:
            1. the user opts to create a new dataset, or
            2. the user passes in a list of existing datasets

        TODO: if a dataset is deleted but there are layers that link to the
        dataset, throw an exception from the API that lists the maps that
        are dependent on the dataset.
        '''
        create_new_dataset = validated_data.pop('create_new_dataset', False)
        datasets = validated_data.pop('datasets', None)

        if not create_new_dataset and datasets is None:
            msg = 'Either create_new_dataset should be set to True '
            msg += 'or datasets should contain a list of valid dataset IDs'
            raise serializers.ValidationError(msg)

        import uuid
        validated_data['slug'] = uuid.uuid4().hex
        validated_data.update(self.get_presave_create_dictionary())
        if validated_data.get('panel_styles') is None:
            validated_data['panel_styles'] = \
                models.StyledMap.default_panel_styles
        self.instance = self.Meta.model.objects.create(**validated_data)

        layers = []
        if datasets:
            project_id = validated_data.get('project_id')
            datasets = self.get_datasets(datasets, project_id)
            i = 1
            for dataset in datasets:
                layer = models.Layer.create(
                    last_updated_by=validated_data.get('last_updated_by'),
                    owner=validated_data.get('owner'),
                    title=dataset.name + ' Layer',
                    styled_map=self.instance,
                    project=self.instance.project,
                    dataset=dataset,
                    group_by='uniform',
                    symbols=[
                        models.Symbol.SIMPLE.to_dict()
                    ],
                    display_field=dataset.fields[0],
                    ordering=i
                )
                i += 1
                layers.append(layer)
        else:
            layer = models.Layer.create(
                last_updated_by=validated_data.get('last_updated_by'),
                owner=validated_data.get('owner'),
                styled_map=self.instance,
                group_by='uniform',
                project=self.instance.project,
                ordering=1
            )
            layers.append(layer)
        return self.instance


class MapSerializerDetail(MapSerializerList):
    layers = serializers.SerializerMethodField()
    layers_url = serializers.SerializerMethodField()

    def get_layers(self, obj):
        layers = models.Layer.objects.filter(styled_map=obj)
        return LayerSerializer(layers, many=True, context={'request': {}}).data

    def get_layers_url(self, obj):
        return '%s/api/0/maps/%s/layers/' % (settings.SERVER_URL, obj.id)

    class Meta:
        model = models.StyledMap
        fields = MapSerializerList.Meta.fields + (
            'slug', 'layers', 'layers_url')
        depth = 0


class MapSerializerDetailSlug(MapSerializerDetail):
    extra_kwargs = {
        'url': {'lookup_field': 'slug'}
    }
