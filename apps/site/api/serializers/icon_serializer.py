import os, sys
from django.conf import settings
from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.lib.helpers import upload_helpers, generic
from localground.apps.site.api import fields


class IconSerializer(BaseSerializer):
    ext_whitelist = ['jpg', 'jpeg', 'png', 'svg']
    icon = serializers.CharField(
        source='file_name_orig', required=True, style={'base_template': 'file.html'},
        help_text='Valid file types are: ' + ', '.join(ext_whitelist)
    )

    file_path = serializers.SerializerMethodField('get_file_path_new')
    project_id = fields.ProjectField(
        label='project_id', 
        source='project', 
        required=False)
    owner = serializers.SerializerMethodField()


    class Meta:
        model = models.Icon
        read_only_fields = ('width', 'height', 'file_type')
        fields = ('url', 'id', 'name', 'icon', 'file_type', 'file_path', 'owner', 'project_id', 'width', 'height', 'anchor_x', 'anchor_y')
        depth = 0
    
    def get_file_path_new(self, obj):
        return obj.encrypt_url(obj.file_name_new)

    def get_owner(self, obj):
        return obj.owner.username

    def process_file(self, file, owner):
        from PIL import Image, ImageOps
        #save to disk:
        model_name_plural = models.Icon.model_name_plural
        file_name_new = upload_helpers.save_file_to_disk(owner, model_name_plural, file)
        file_name, ext = os.path.splitext(file_name_new)
        file_type = ext.replace('.', '').lower()
        if file_type == 'jpeg':
            file_type = 'jpg'
        return {
            'file_name_orig': file.name,
            'name': self.initial_data.get('name') or file.name,
            'file_name_new': file_name_new,
            'file_type': file_type,
            'virtual_path': upload_helpers.generate_relative_path(owner, model_name_plural),
            'width': 100,
            'height': 100
        }
        
    def create(self, validated_data):
        # Overriding the create method to handle file processing
        owner = self.context.get('request').user
        f = self.initial_data.get('icon')
        
        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)
        
        # save it to disk
        data = self.process_file(f, owner)
        data.update(self.get_presave_create_dictionary())
        data.update({
            'host': settings.SERVER_HOST
        })
        data.update(validated_data)
        self.instance = self.Meta.model.objects.create(**data)
        return self.instance
    
    
class IconSerializerUpdate(IconSerializer):
    icon = serializers.CharField(source='file_name_orig', required=False, read_only=True)
