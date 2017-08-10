import os, sys
from django.conf import settings
from localground.apps.site.api.serializers.base_serializer import BaseSerializer, ProjectSerializerMixin
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.lib.helpers import upload_helpers, generic
from localground.apps.site.api import fields
from PIL import Image, ImageOps


class IconSerializer(ProjectSerializerMixin, BaseSerializer):
    ext_whitelist = ['jpg', 'jpeg', 'png', 'svg']
    icon = serializers.CharField(
        source='file_name_orig', required=True, style={'base_template': 'file.html'},
        help_text='Valid file types are: ' + ', '.join(ext_whitelist)
    )

    file_path = serializers.SerializerMethodField('get_file_path_new')
    owner = serializers.SerializerMethodField()
    
    class Meta:
        model = models.Icon
        read_only_fields = ('width', 'height', 'file_type')
        fields = ('url', 'id', 'name', 'icon', 'file_type', 'file_path',
                  'owner', 'project_id', 'width', 'height', 'anchor_x', 'anchor_y')
        depth = 0
    
    def get_file_path_new(self, obj):
        return obj.encrypt_url(obj.file_name_new)

    def get_owner(self, obj):
        return obj.owner.username

    def process_file(self, file, owner):
        #save to disk:
        model_name_plural = models.Icon.model_name_plural
        file_name_new = upload_helpers.save_file_to_disk(owner, model_name_plural, file)
        file_name, ext = os.path.splitext(file_name_new)
        file_type = ext.replace('.', '').lower()
        if file_type == 'jpeg':
            file_type = 'jpg'

        # resize icon if needed:
        media_path = upload_helpers.generate_absolute_path(
            owner, model_name_plural)
        im = Image.open(media_path + '/' + file_name_new)
        #set max and min sizes for icon
        size_max = 250.0
        size_min = 10.0
        #get largest and smallest value of image
        icon_max = max(im.size)
        icon_min = min(im.size)
        #calculate scale_ratio
        if icon_max > size_max:
            scale_ratio = size_max / icon_max
        elif icon_min < size_min:
            scale_ratio = size_min / icon_min
        else:
            scale_ratio = 1
        #resize icon if needed
        #raise Exception (im.size, scale_ratio)
        if scale_ratio != 1:
            new_x = int ((im.size)[0] * scale_ratio)
            new_y = int ((im.size)[1] * scale_ratio)
            im = im.resize((new_x, new_y))
            s='resized'
            #abs_path = '%s/%s' % (media_path, file_name_new)
            abs_path = '%s/%s_%s%s' % (media_path,file_name, s, ext)
            im.save(abs_path)

        return {
            'file_name_orig': file.name,
            'name': self.initial_data.get('name') or file.name,
            'file_name_new': file_name_new,
            'file_type': file_type,
            'virtual_path': upload_helpers.generate_relative_path(owner, model_name_plural),
            'width': im.size[0],
            'height': im.size[1],
            'anchor_x': im.size[0]/2,
            'anchor_y': im.size[1]/2
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
