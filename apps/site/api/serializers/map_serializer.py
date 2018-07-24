from localground.apps.site.api.serializers.base_serializer import \
    NamedSerializerMixin, ProjectSerializerMixin, BaseSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
import uuid
from django.conf import settings
from localground.apps.site.api.serializers.layer_serializer import \
    LayerSerializer
import hashlib


# Validators:
class MetadataValidator(object):
    def __call__(self, value):
        self._validate_access_level()
        self._validate_boolean_flags()
        if self._is_password_protected():
            self._validate_password()

    def _validate_access_level(self):
        if self.accessLevel not in [1, 2, 3]:
            raise serializers.ValidationError(
                'The accessLevel must be set to 1, 2, or 3.')
        if self.accessLevel in [1, 2]:
            # Map is not password protected, so clear out old password:
            if self.instance:
                self.instance.password = None

    def _validate_boolean_flags(self):
        metadata = self._get_metadata()
        for key in [
                'displayLegend', 'nextPrevButtons', 'allowPanZoom',
                'streetview', 'displayTitleCard'
                ]:
            try:
                if not isinstance(metadata[key], bool):
                    self._raise_boolean_error(key)
            except Exception:
                self._raise_boolean_error(key)

    def _get_metadata(self):
        import json
        if isinstance(self.data.get('metadata'), basestring):
            return json.loads(self.data.get('metadata'))
        else:
            return self.data.get('metadata')

    def set_context(self, serializer_field):
        # In `__call__` we can  use this to inform the validation behavior.
        self.request = serializer_field.parent.context.get('request')
        self.data = self.request.data  # immutable
        self.instance = serializer_field.parent.instance
        self.password = self.data.get('password')
        print self.password
        self.accessLevel = self._get_metadata().get('accessLevel')

    def _has_existing_password(self):
        return self.instance and self.instance.password \
            and len(self.instance.password) > 2

    def _raise_boolean_error(self, key):
        self._raise_error(
            'The metadata property {0} must be a boolean'.format(key))

    def _raise_password_error(self):
        self._raise_error(
            'A password of at least three characters is required.')

    def _raise_error(self, message):
        raise serializers.ValidationError(message)

    def _validate_password(self):
        if self.password is None or self.password == '':
            if not self._has_existing_password():
                self._raise_password_error()
        elif len(self.password) < 3:
            self._raise_password_error()

    def _is_password_protected(self):
        return self.accessLevel == \
            models.StyledMap.Permissions.PASSWORD_PROTECTED


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
        style={'base_template': 'json.html', 'rows': 5},
        required=False,
        validators=[MetadataValidator()]
    )
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
    layers = serializers.SerializerMethodField()
    layers_url = serializers.SerializerMethodField()
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        style={'input_type': 'password'}
    )

    def _encrypt_password(self, validated_data):
        password = validated_data.get('password')
        if password is not None:
            if len(password) > 0:
                md5 = hashlib.md5(password)
                validated_data['password'] = md5.hexdigest()
            else:
                del validated_data['password']

    def update(self, instance, validated_data):
        self._encrypt_password(validated_data)
        return super(MapSerializerDetail, self).update(
            instance, validated_data)

    def get_layers(self, obj):
        layers = models.Layer.objects.filter(styled_map=obj)
        return LayerSerializer(layers, many=True, context={'request': {}}).data

    def get_layers_url(self, obj):
        return '%s/api/0/maps/%s/layers/' % (settings.SERVER_URL, obj.id)

    class Meta:
        model = models.StyledMap
        fields = MapSerializerList.Meta.fields + (
            'slug', 'layers', 'layers_url', 'password')
        depth = 0


class MapSerializerDetailSlug(MapSerializerDetail):
    extra_kwargs = {
        'url': {'lookup_field': 'slug'}
    }
