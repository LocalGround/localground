from rest_framework import serializers
from django.conf import settings
from localground.apps.lib.helpers import upload_helpers, generic
from localground.apps.site import models
from localground.apps.site.api import fields
from localground.apps.site.api.serializers.base_serializer import \
    NamedSerializerMixin, BaseSerializer


class MapImageSerializerCreate(NamedSerializerMixin, BaseSerializer):

    def __init__(self, *args, **kwargs):
        super(MapImageSerializerCreate, self).__init__(*args, **kwargs)
        if not self.instance:
            return
        try:
            model = self.instance[0]
        except Exception:
            model = self.instance
        # Sets the storage location upon initialization:
        model.media_file_thumb.storage.location = model.get_storage_location()

    ext_whitelist = ['jpg', 'jpeg', 'gif', 'png']
    media_file = serializers.CharField(
        source='file_name_orig',
        required=True,
        style={'base_template': 'file.html'},
        help_text='Valid file types are: ' + ', '.join(ext_whitelist)
    )
    status = serializers.PrimaryKeyRelatedField(
        read_only=False,
        required=False,
        default=1,
        queryset=models.StatusCode.objects.all()
    )
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Project.objects.all(),
        source='project',
        required=False
    )
    source_print = serializers.PrimaryKeyRelatedField(
        queryset=models.Print.objects.all(),
        required=False,
        allow_null=True
    )
    geometry = fields.GeometryField(
        help_text='Assign a GeoJSON string',
        allow_null=True,
        required=False,
        read_only=True,
        style={'base_template': 'json.html'},
        source='processed_image.extents'
    )
    overlay_path = serializers.SerializerMethodField()
    file_path = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()
    media_thumb_url = serializers.SerializerMethodField()
    media_scaled_url = serializers.SerializerMethodField()

    def get_fields(self, *args, **kwargs):
        fields = super(
            MapImageSerializerCreate, self).get_fields(*args, **kwargs)
        # restrict project list at runtime:
        fields['project_id'].queryset = self.get_projects()
        return fields

    class Meta:
        model = models.MapImage
        fields = BaseSerializer.field_list + \
            NamedSerializerMixin.field_list + (
                'overlay_type', 'source_print', 'project_id', 'geometry',
                'overlay_path', 'media_file', 'file_path', 'file_name',
                'uuid', 'status', 'media_thumb_url', 'media_scaled_url'
            )
        read_only_fields = ('uuid',)

    def create(self, validated_data):
        # Overriding the create method to handle file processing
        # owner = self.context.get('request').user
        f = self.initial_data.get('media_file')

        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)

        owner = self.context.get('request').user
        validated_data = {}
        validated_data.update(self.validated_data)
        validated_data.update(self.get_presave_create_dictionary())
        validated_data.update({
            'uuid': generic.generateID(),
            'status': models.StatusCode.objects.get(
                id=models.StatusCode.READY_FOR_PROCESSING),
            'upload_source': models.UploadSource.objects.get(
                id=models.UploadSource.WEB_FORM),
            'attribution': validated_data.get('attribution') or owner.username,
            'host': settings.SERVER_HOST
        })
        self.instance = self.Meta.model.objects.create(**validated_data)

        # process map onto the instance
        # from localground.apps.tasks import process_map
        # result = process_map.delay(self.instance)

        # now save the map_image to S3
        self.instance.process_mapImage_to_S3(f)
        return self.instance

    def get_file_path(self, obj):
        try:
            return obj.media_file_thumb.url
        except Exception:
            return None

    def get_file_name(self, obj):
        try:
            return obj.media_file_thumb.name
        except Exception:
            return None

    def get_overlay_path(self, obj):
        return obj.processed_map_url_path()

    def get_media_thumb_url(self, obj):
        try:
            return obj.media_file_thumb.url
        except Exception:
            return None

    def get_media_scaled_url(self, obj):
        try:
            return obj.media_file_scaled.url
        except Exception:
            return None


class MapImageSerializerUpdate(MapImageSerializerCreate):
    media_file = serializers.CharField(
        source='file_name_orig', required=False, read_only=True)
    status = serializers.PrimaryKeyRelatedField(
        queryset=models.StatusCode.objects.all(),
        read_only=False)

    class Meta:
        model = models.MapImage
        fields = BaseSerializer.field_list + NamedSerializerMixin.field_list + (
            'overlay_type', 'source_print', 'project_id',
            'geometry', 'overlay_path',
            'media_file', 'file_path', 'file_name', 'uuid', 'status'
        )
        read_only_fields = ('uuid',)

    # overriding update
    def update(self, instance, validated_data):
        instance = super(
            MapImageSerializerUpdate, self).update(instance, validated_data)

        from localground.apps.tasks import process_map
        result = process_map.delay(self.instance)

        return instance
