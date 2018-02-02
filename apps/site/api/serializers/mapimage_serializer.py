import os, json
from rest_framework import serializers
from django.conf import settings
from django.forms.fields import FileField
from localground.apps.lib.helpers import upload_helpers, generic, get_timestamp_no_milliseconds
from localground.apps.site import models
from localground.apps.site.api import fields
from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer, AuditSerializerMixin


class MapImageSerializerCreate(BaseNamedSerializer):
    ext_whitelist = ['jpg', 'jpeg', 'gif', 'png']
    media_file = serializers.CharField(
        source='file_name_orig', required=True, style={'base_template': 'file.html'},
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

    '''
    Proposal:
    I think that when an image is inserted, a default ImageOpts
    object should be created. This can be overwritten by the
    image processor. Sample code:
    -----------------------------------------------------------
    map_image = models.ImageOpts(
        source_mapimage=self.mapimage,
        file_name_orig=file_name,
        zoom=p.zoom,
        host=self.mapimage.host,
        virtual_path=self.mapimage.virtual_path
    )

    #pseudocode:

    map_image.center = p.center
    map_image.save(user=self.user)
    '''

    def get_fields(self, *args, **kwargs):
        fields = super(MapImageSerializerCreate, self).get_fields(*args, **kwargs)
        #restrict project list at runtime:
        fields['project_id'].queryset = self.get_projects()
        return fields

    class Meta:
        model = models.MapImage
        fields = BaseNamedSerializer.Meta.fields + (
            'overlay_type', 'source_print', 'project_id', 'geometry',
            'overlay_path', 'media_file', 'file_path', 'file_name', 'uuid', 'status'
        )
        read_only_fields = ('uuid',)

    # Will eventually delete because instance is now taking care of process
    def process_file(self, file, owner):
        #save to disk: Will eventually be removed
        model_name_plural = models.MapImage.model_name_plural
        uuid = generic.generateID()
        file_name_new = upload_helpers.save_file_to_disk(owner, model_name_plural, file, uuid=uuid)
        file_name, ext = os.path.splitext(file_name_new)

        '''
        # eventual goal for process file:
        # self.instance.send_map_images_to_S3()

        # Seems that map image serializer is similar to
        # photo serializer that it takes an image
        # but also seems to should act like print serializer
        # because the file path has to be generated
        # before it can be properly saved to the Amazon S3 Cloud

        # Some mock code that seems to follow the other updated serializers

        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)

        # Save it to Amazon S3 cloud
        self.validated_data.update(self.get_presave_create_dictionary())
        self.validated_data.update({
            'attribution': validated_data.get('attribution') or owner.username
        })
        self.instance = self.Meta.model.objects.create(**self.validated_data)

        '''

        # create thumbnail:
        from PIL import Image
        thumbnail_name = '%s_thumb.png' % file_name
        media_path = upload_helpers.generate_absolute_path(owner, model_name_plural, uuid=uuid)
        im = Image.open(media_path + '/' + file_name_new)
        im.thumbnail([500, 500], Image.ANTIALIAS)
        # Looks similar to the LGFileField parameters for save
        # except that it has to be tweaked to match S3 standards
        im.save('%s/%s' % (media_path, thumbnail_name))

        return {
            'uuid': uuid,
            'file_name_orig': file.name,
            'name': self.initial_data.get('name') or file.name,
            'file_name_new': file_name_new,
            'file_name_thumb': thumbnail_name,
            'content_type': ext.replace('.', ''),
            'virtual_path': upload_helpers.generate_relative_path(owner, model_name_plural, uuid=uuid)
        }

    def create(self, validated_data):
        # Overriding the create method to handle file processing
        # owner = self.context.get('request').user
        f = self.initial_data.get('media_file')

        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)

        validated_data.update(self.validated_data)
        validated_data.update(self.get_presave_create_dictionary())
        # validated_data.update(extras)
        self.instance = self.Meta.model.objects.create(**validated_data)

        # process map onto the instance
        from localground.apps.tasks import process_map
        result = process_map.delay(self.instance)
        # now save the map_image to S3
        self.instance.process_mapImage_to_S3(f)

        return self.instance

    def get_file_path(self, obj):
        return obj.encrypt_url(obj.file_name_new)

    def get_file_name(self, obj):
        if obj.processed_image:
            return obj.processed_image.file_name_orig
        return None

    '''
    def get_north(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.northeast.y

    def get_east(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.northeast.x

    def get_south(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.southwest.y

    def get_west(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.southwest.x

    def get_zoom(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.zoom
    '''

    def get_overlay_path(self, obj):
        return obj.processed_map_url_path()

class MapImageSerializerUpdate(MapImageSerializerCreate):
    media_file = serializers.CharField(source='file_name_orig', required=False, read_only=True)
    status = serializers.PrimaryKeyRelatedField(
        queryset=models.StatusCode.objects.all(),
        read_only=False)
    class Meta:
        model = models.MapImage
        fields = BaseNamedSerializer.Meta.fields + (
            'overlay_type', 'source_print', 'project_id',
            'geometry', 'overlay_path',
            'media_file', 'file_path', 'file_name', 'uuid', 'status'
        )
        read_only_fields = ('uuid',)

    # overriding update
    def update(self, instance, validated_data):
        instance = super(MapImageSerializerUpdate, self).update(instance, validated_data)

        from localground.apps.tasks import process_map
        result = process_map.delay(self.instance)

        return instance
