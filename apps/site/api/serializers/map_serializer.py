from localground.apps.site.api.serializers.base_serializer import \
    BaseNamedSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings
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
    data_sources = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5},
        required=True, write_only=True)

    def create_form(self):
        owner = self.context.get('request').user
        'last_updated_by': self.context.get('request').user,
        'time_stamp': get_timestamp_no_milliseconds()
        form = models.Form(
            owner=user or self.user,
            name=name,
            description=description,
            last_updated_by=user or self.user,
            project=project or self.project
        )
        f.save()

    def get_datasets(self, data_sources):
        datasets = []
        if len(data_sources) == 0:
            raise serializers.ValidationError('At least one data source should be specified in the data_sources array')
        for data_source in data_sources:
            if data_source == 'create_new':
                raise serializers.ValidationError('Create new dataset!')
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
        data_sources = validated_data.pop('data_sources', None)
        datasets = self.get_datasets(data_sources)
        raise Exception(datasets)
        validated_data.update(self.get_presave_create_dictionary())
        self.instance = self.Meta.model.objects.create(**validated_data)
        return self.instance

    def get_fields(self, *args, **kwargs):
        fields = super(MapSerializer, self).get_fields(*args, **kwargs)
        # restrict project list at runtime:
        fields['project_id'].queryset = self.get_projects()
        return fields

    class Meta:
        model = models.StyledMap
        fields = BaseNamedSerializer.Meta.fields + (
            'slug', 'sharing_url', 'center', 'basemap', 'zoom',
            'panel_styles', 'project_id', 'data_sources')
        depth = 0

    def get_sharing_url(self, obj):
        return obj.slug


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
