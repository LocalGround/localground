import os, sys
from django.conf import settings
from localground.apps.site.api.serializers.base_serializer import BaseSerializer, ProjectSerializerMixin
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.lib.helpers import upload_helpers, generic
from localground.apps.site.api import fields
from PIL import Image, ImageOps

class IconSerializerBase(ProjectSerializerMixin, BaseSerializer):
    ext_whitelist = ['jpg', 'jpeg', 'png', 'svg']
    icon = serializers.CharField(
        source='file_name_orig', required=True, style={'base_template': 'file.html'},
        help_text='Valid file types are: ' + ', '.join(ext_whitelist)
    )
    #set max and min sizes for icon
    size_max = 250.0
    size_min = 10.0
    size = serializers.IntegerField(max_value=size_max, min_value=size_min)
    file_path = serializers.SerializerMethodField('get_file_path_new')
    owner = serializers.SerializerMethodField()
    
    def resize_icon(self, owner, file_name_new, validated_data):
        file_name, ext = os.path.splitext(file_name_new)
        file_type = ext.replace('.', '').lower()
        if file_type == 'jpeg':
            file_type = 'jpg'
        file_name_resized = file_name + '_resized.' + file_type
        media_path = upload_helpers.generate_absolute_path(
            owner, "icons")
        #raise Exception(media_path + '/' + file_name_new)
        im = Image.open(media_path + '/' + file_name_new)
        

        #get size user entered.  If user didn't enter anything, use largest icon size or max size
        if validated_data.get('size'):
            size = validated_data.get('size')
        else:
            size = max(im.size)
        if size > self.size_max:
            size = self.size_max
        #compare 
        #get largest and smallest value of image
        icon_max = max(im.size)
        icon_min = min(im.size)
        #calculate scale_ratio
        if icon_max > self.size_max:
            scale_ratio = self.size_max / icon_max
        elif icon_min < self.size_min:
            scale_ratio = self.size_min / icon_min
        else:
            scale_ratio = 1.0
        #resize icon if needed
        if scale_ratio != 1.0:
            new_x = (im.size)[0] * scale_ratio
            new_y = (im.size)[1] * scale_ratio
            im.thumbnail((int(new_x), int(new_y)), Image.ANTIALIAS)
            abs_path = '%s/%s%s' % (media_path, file_name_resized, ext)
            im.save(abs_path)
        anchor_x = im.size[0]/2
        anchor_y = im.size[1] / 2
        if validated_data.get('anchor_x'):
            anchor_x = validated_data.get('anchor_x') * scale_ratio
        if validated_data.get('anchor_y'):
            anchor_y = validated_data.get('anchor_y') * scale_ratio

        return {
            'width': im.size[0],
            'height': im.size[1],
            'anchor_x': int(anchor_x),
            'anchor_y': int(anchor_y),
            'file_name_new': file_name_new,
            'file_name_resized': file_name_resized,
            'file_type': file_type
        }
    
    def get_file_path_new(self, obj):
        return obj.encrypt_url(obj.file_name_new)

    def get_owner(self, obj):
        return obj.owner.username
    
    class Meta:
        abstract = True


class IconSerializerList(IconSerializerBase):
    
    class Meta:
        model = models.Icon
        read_only_fields = ('width', 'height', 'anchor_x', 'anchor_y', 'file_type')
        fields = ('url', 'id', 'name', 'icon', 'file_type', 'file_path',
                  'owner', 'project_id', 'size', 'width', 'height', 'anchor_x', 'anchor_y')
        depth = 0
        
    def create_file(self, file, owner, validated_data):
            file_name = file.name
            file_name_new = upload_helpers.save_file_to_disk(owner, "icons", file)
            resized_icon_parameters = self.resize_icon(owner, file_name_new, validated_data)
            return resized_icon_parameters
        
    def create(self, validated_data):
        # Overriding the create method to handle file processing
        owner = self.context.get('request').user
        f = self.initial_data.get('icon')
        
        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)
        
        # save it to disk
        data = self.get_presave_create_dictionary()
        data.update(validated_data)
        
        resized_icon_parameters = self.create_file(f, owner, validated_data)
        data.update(resized_icon_parameters)
        data.update({
            'host': settings.SERVER_HOST,
            'file_name_orig': f.name,
            'name': self.validated_data.get('name') or f.name,
            'virtual_path': upload_helpers.generate_relative_path(owner, "icons")
        })
        raise Exception(data)

        self.instance = self.Meta.model.objects.create(**data)
        return self.instance
    
    
class IconSerializerUpdate(IconSerializerBase):
    icon = serializers.CharField(source='file_name_orig', required=False, read_only=True)

    def update(self, instance, validated_data):
        data = self.get_presave_update_dictionary()
        data.update(validated_data)
        resized_icon_parameters = self.resize_icon(owner, instance.file_name_new, validated_data)
        data.update(resized_icon_parameters)
        return super(AuditSerializerMixin, self).update(instance, data)
    
    class Meta:
        model = models.Icon
        read_only_fields = ('width', 'height', 'file_type')
        fields = ('url', 'id', 'name', 'icon', 'file_type', 'file_path',
                  'owner', 'project_id', 'size', 'width', 'height', 'anchor_x', 'anchor_y')
        depth = 0
