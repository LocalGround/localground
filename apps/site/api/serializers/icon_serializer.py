import os, sys
from django.conf import settings
from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.fields import FileField
from localground.apps.lib.helpers import upload_helpers, generic

class IconSerializer(BaseSerializer):
    
    #help_text='Valid file types are: ' + ', '.join(ext_whitelist)

    class Meta:
        model = models.Icon
        fields = BaseSerializer.Meta.fields 
        depth = 0

    def process_file(self, file, owner):
        from PIL import Image, ImageOps
        #save to disk:
        model_name_plural = models.Icon.model_name_plural
        file_name_new = upload_helpers.save_file_to_disk(owner, model_name_plural, file)
        file_name, ext = os.path.splitext(file_name_new)

        # create thumbnails:
        media_path = upload_helpers.generate_absolute_path(owner, model_name_plural)
        im = Image.open(media_path + '/' + file_name_new)
        exif = models.Icon.read_exif_data(im)
        sizes = [1000, 500, 250, 128, 50, 20]
        icon_paths = [file_name_new]
        for s in sizes:
            if s in [50, 25]:
                # ensure that perfect squares:
                im.thumbnail((s * 2, s * 2), Image.ANTIALIAS)
                im = im.crop([0, 0, s - 2, s - 2])
                # for some reason, ImageOps.expand throws an error for some files:
                im = ImageOps.expand(im, border=2, fill=(255, 255, 255, 255))
            else:
                im.thumbnail((s, s), Image.ANTIALIAS)
            abs_path = '%s/%s_%s%s' % (media_path, file_name, s, ext)
            im.save(abs_path)
            icon_paths.append('%s_%s%s' % (file_name, s, ext))
        
        return {
            'file_name_orig': file.name,
            'name': self.initial_data.get('name') or file.name,
            'file_name_new': file_name_new,
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
        data = self.process_file(f, owner)
        data.update(self.get_presave_create_dictionary())
        data.update({
            'host': settings.SERVER_HOST
        })
        data.update(validated_data)
        self.instance = self.Meta.model.objects.create(**data)
        return self.instance
    
class IconSerializerUpdate(IconSerializer):
    media_file = serializers.CharField(source='file_name_orig', required=False, read_only=True)
