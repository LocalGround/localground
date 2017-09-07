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
    icon_file = serializers.CharField(
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
        
        #get largest and smallest value of image
        icon_max = max(im.size) * 1.0
        icon_min = min(im.size) * 1.0

        #get size user entered.  If user didn't enter anything, use largest icon size or size_max.
        #also check to make sure icon size is >= size_min
        if validated_data.get('size'):
            size = validated_data.get('size')
        elif icon_max > self.size_max:
            size = self.size_max
        elif icon_min < self.size_min:
            size = self.size_min
        else:
            size = icon_max
        
        #calculate scale_ratio
        if icon_max > size:
            scale_ratio = size / icon_max
        elif icon_min < size:
            scale_ratio = size / icon_min
        else:
            scale_ratio = 1.0

        #check for case where resizing by scale ratio would make icon_max too large
        if scale_ratio > self.size_max / icon_max:
            scale_ratio = self.size_max / icon_max
#code to look at
#function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
#    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
#   return {width: srcWidth * ratio, height: srcHeight * ratio};
# }

        #raise Exception(size, scale_ratio)
        #resize icon if needed
        if scale_ratio != 1.0:
            new_x = int (round ((im.size)[0] * scale_ratio))
            new_y = int (round ((im.size)[1] * scale_ratio))
            im.thumbnail((new_x, new_y), Image.ANTIALIAS)
            abs_path = '%s/%s' % (media_path, file_name_resized)
            im.save(abs_path)
        #set anchor point center of icon or user entered coordinates
        anchor_x = im.size[0] / 2.0
        anchor_y = im.size[1] / 2.0
        validated_data_x = validated_data.get('anchor_x')
        validated_data_y = validated_data.get('anchor_y')
        if validated_data_x is not None and validated_data_x <= new_x:
            anchor_x = validated_data_x
            #validated_data['anchor_x'] = anchor_x
        if validated_data_y is not None and validated_data_y <= new_y:
            anchor_y = validated_data_y
            #validated_data['anchor_y'] = anchor_y

        return {
            'width': im.size[0],
            'height': im.size[1],
            'anchor_x': anchor_x,
            'anchor_y': anchor_y,
            'file_name_new': file_name_new,
            'file_name_resized': file_name_resized,
            'file_type': file_type
        }
    
    def get_file_path_new(self, obj):
        #return obj.file_name_resized
        return obj.encrypt_url(obj.file_name_resized)

    def get_owner(self, obj):
        return obj.owner.username
    
    class Meta:
        abstract = True


class IconSerializerList(IconSerializerBase):
    anchor_x = serializers.IntegerField(read_only=False, required=False)
    anchor_y = serializers.IntegerField(read_only=False, required=False)
    width = serializers.IntegerField(read_only=True)
    height = serializers.IntegerField(read_only=True)   
    class Meta:
        model = models.Icon
        read_only_fields = ('width', 'height', 'file_type')
        fields = ('url', 'id', 'name', 'icon_file', 'file_type', 'file_path',
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
        #raise Exception(data)

        self.instance = self.Meta.model.objects.create(**data)
        return self.instance
    
    
class IconSerializerUpdate(IconSerializerBase):
    anchor_x = serializers.IntegerField(allow_null=True, max_value=IconSerializerBase.size_max, min_value=0)
    anchor_y = serializers.IntegerField(allow_null=True, max_value=IconSerializerBase.size_max, min_value=0)
    width = serializers.IntegerField(read_only=True)
    height = serializers.IntegerField(read_only=True)
    icon_file = serializers.CharField(source='file_name_orig', required=False, read_only=True)
    project_id = serializers.SerializerMethodField()

    def get_project_id(self, obj):
        # Instance is read-only
        return obj.project.id

    def update(self, instance, validated_data):
        data = self.get_presave_update_dictionary()
        data.update(validated_data)
        resized_icon_parameters = self.resize_icon(instance.owner, instance.file_name_new, validated_data)
        data.update(resized_icon_parameters)
        return super(IconSerializerBase, self).update(instance, data)
    
    class Meta:
        model = models.Icon
        read_only_fields = ('width', 'height', 'project_id', 'file_type')
        fields = ('url', 'id', 'name', 'icon_file', 'file_type', 'file_path',
                  'owner', 'size', 'width', 'height', 'project_id', 'anchor_x', 'anchor_y')
        depth = 0
