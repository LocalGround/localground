import os
from rest_framework import serializers
from django.conf import settings
from django.forms.fields import FileField
from localground.apps.lib.helpers import upload_helpers, generic, get_timestamp_no_milliseconds
from localground.apps.site import models
from localground.apps.site.api import fields
from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer

class ScanSerializerCreate(BaseNamedSerializer):
    ext_whitelist = ['jpg', 'jpeg', 'gif', 'png']
    file_path = serializers.SerializerMethodField('get_file_path_new')
    media_file = serializers.CharField(source='file_name_orig', required=True, style={'base_template': 'file.html'})
    overlay_type = serializers.SerializerMethodField()
    project_id = fields.ProjectField(source='project', required=False)
    north = serializers.SerializerMethodField()
    south = serializers.SerializerMethodField()
    east = serializers.SerializerMethodField()
    west = serializers.SerializerMethodField()
    zoom = serializers.SerializerMethodField()
    overlay_path = serializers.SerializerMethodField()

    class Meta:
        model = models.Scan
        fields = BaseNamedSerializer.Meta.fields + (
            'overlay_type', 'source_print', 'project_id',
            'north', 'south', 'east', 'west', 'zoom', 'overlay_path',
            'media_file', 'file_path'
        )
        
    def process_file(self, file, owner):
        #save to disk:
        model_name_plural = models.Scan.model_name_plural
        file_name_new = upload_helpers.save_file_to_disk(owner, model_name_plural, file)
        file_name, ext = os.path.splitext(file_name_new)
        
        # create thumbnail:
        from PIL import Image
        thumbnail_name = '%s_thumb.png' % file_name
        media_path = upload_helpers.generate_absolute_path(owner, model_name_plural)
        im = Image.open(media_path + '/' + file_name_new)
        im.thumbnail([500, 500], Image.ANTIALIAS)
        im.save('%s/%s' % (media_path, thumbnail_name))
        
        return {
            'file_name_orig': file.name,
            'name': self.initial_data.get('name') or file.name,
            'file_name_new': file_name_new,
            'file_name_thumb': thumbnail_name,
            'content_type': ext.replace('.', ''),
            'virtual_path': upload_helpers.generate_relative_path(owner, model_name_plural)
        }
        
    def create(self, validated_data):
        # Overriding the create method to handle file processing
        owner = self.context.get('request').user
        f = self.initial_data.get('media_file')
        
        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)
        
        # save it to disk
        extras = self.process_file(f, owner)
        extras.update({
            'uuid': generic.generateID(),
            'status': models.StatusCode.objects.get(id=3), #Make writeable field in serializer?
            'upload_source': models.UploadSource.objects.get(id=1),
            'owner': owner,
            'last_updated_by': owner,
            'time_stamp': get_timestamp_no_milliseconds(),
            'attribution': owner.username,
            'host': settings.SERVER_HOST
        })
        validated_data = {}
        validated_data.update(self.validated_data)
        validated_data.update(extras)
        self.instance = models.Scan.objects.create(**validated_data)
        return self.instance

    def get_file_path_new(self, obj):
        return obj.encrypt_url(obj.file_name_new)

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

    def get_overlay_path(self, obj):
        return obj.processed_map_url_path()
    
class ScanSerializerUpdate(ScanSerializerCreate):
    media_file = serializers.CharField(source='file_name_orig', required=False, read_only=True)

