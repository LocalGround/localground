from localground.apps.site.api.serializers.base_serializer import \
    NamedSerializerMixin, ProjectSerializerMixin, BaseSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
import uuid
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
    metadata = fields.JSONField(
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
                'metadata', 'slug', 'layers', 'layers_url'
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
        if dataset_ids is None or len(dataset_ids) == 0:
            return None
        datasets = []
        for dataset_id in dataset_ids:
            try:
                dataset_id = int(dataset_id)
                dataset = models.Dataset.objects.get(id=dataset_id)
                datasets.append(dataset)
            except Exception:
                raise serializers.ValidationError(
                    '{0} is not a valid dataset id'.format(dataset_id))
        return datasets

    def create(self, validated_data):
        create_new_dataset = validated_data.pop('create_new_dataset', False)
        dataset_ids = validated_data.pop('datasets', None)

        if not create_new_dataset and dataset_ids is None:
            msg = 'Either create_new_dataset should be set to True '
            msg += 'or datasets should contain a list of valid dataset IDs'
            raise serializers.ValidationError(msg)

        validated_data['slug'] = uuid.uuid4().hex
        validated_data.update(self.get_presave_create_dictionary())
        if validated_data.get('panel_styles') is None:
            validated_data['panel_styles'] = \
                models.StyledMap.default_panel_styles
        if validated_data.get('metadata') is None:
            validated_data['metadata'] = models.StyledMap.default_metadata
        datasets = self.get_datasets(
            dataset_ids, validated_data.get('project_id'))
        self.instance = self.Meta.model.create(
            datasets=datasets, **validated_data)
        return self.instance


class MapSerializerDetail(MapSerializerList):
    def min_length(value):
        if value is not None and len(value) < 3:
            raise serializers.ValidationError(
                'The password must be at least three characters long.')

    layers = serializers.SerializerMethodField()
    layers_url = serializers.SerializerMethodField()
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        style={'input_type': 'password'},
        validators=[min_length]
    )

    def get_layers(self, obj):
        layers = models.Layer.objects.filter(styled_map=obj)
        return LayerSerializer(layers, many=True, context={'request': {}}).data

    def get_layers_url(self, obj):
        return '%s/api/0/maps/%s/layers/' % (settings.SERVER_URL, obj.id)

    def is_password_protected(self, validated_data):
        request = self.context.get('request')
        accessLevel = validated_data.get('metadata').get('accessLevel')
        if accessLevel not in [1, 2, 3]:
            raise serializers.ValidationError(
                'The accessLevel must be set to 1, 2, or 3.')
        return accessLevel == models.StyledMap.Permissions.PASSWORD_PROTECTED

    def validate_permissions(self, instance, validated_data):
        if self.is_password_protected(validated_data):
            # If a new password hasn't been passed in,
            # don't clear out the old one:
            if validated_data.get('password') is None or \
                    validated_data.get('password') == '':
                if instance.password:
                    validated_data['password'] = instance.password
                else:
                    raise serializers.ValidationError(
                        'A password of at least three characters is required.')
        else:
            # Map is not password protected, so clear out old password:
            validated_data['password'] = None
        return validated_data

    def update(self, instance, validated_data):
        validated_data = self.validate_permissions(instance, validated_data)
        return super(MapSerializerDetail, self).update(
            instance, validated_data)

    class Meta:
        model = models.StyledMap
        fields = MapSerializerList.Meta.fields + (
            'slug', 'layers', 'layers_url', 'password')
        depth = 0


class MapSerializerDetailSlug(MapSerializerDetail):
    extra_kwargs = {
        'url': {'lookup_field': 'slug'}
    }
