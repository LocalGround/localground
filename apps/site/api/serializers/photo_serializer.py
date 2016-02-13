import os, sys
from django.conf import settings
from localground.apps.site.api.serializers.base_serializer import MediaGeometrySerializer
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.fields import FileField
from localground.apps.lib.helpers import upload_helpers, generic

class PhotoSerializer(MediaGeometrySerializer):
    path_large = serializers.SerializerMethodField()
    path_medium = serializers.SerializerMethodField()
    path_medium_sm = serializers.SerializerMethodField()
    path_small = serializers.SerializerMethodField()
    path_marker_lg = serializers.SerializerMethodField()
    path_marker_sm = serializers.SerializerMethodField()
    
    #help_text='Valid file types are: ' + ', '.join(ext_whitelist)

    class Meta:
        model = models.Photo
        fields = MediaGeometrySerializer.Meta.fields + (
            'path_large', 'path_medium', 'path_medium_sm',
            'path_small', 'path_marker_lg', 'path_marker_sm'
        )
        depth = 0

    def get_path_large(self, obj):
        return obj.encrypt_url(obj.file_name_large)

    def get_path_medium(self, obj):
        return obj.encrypt_url(obj.file_name_medium)

    def get_path_medium_sm(self, obj):
        return obj.encrypt_url(obj.file_name_medium_sm)

    def get_path_small(self, obj):
        return obj.encrypt_url(obj.file_name_small)

    def get_path_marker_lg(self, obj):
        return obj.encrypt_url(obj.file_name_marker_lg)

    def get_path_marker_sm(self, obj):
        return obj.encrypt_url(obj.file_name_marker_sm)
    
    def process_file(self, file, owner):
        from PIL import Image, ImageOps
        #save to disk:
        model_name_plural = models.Photo.model_name_plural
        file_name_new = upload_helpers.save_file_to_disk(owner, model_name_plural, file)
        file_name, ext = os.path.splitext(file_name_new)

        # create thumbnails:
        media_path = upload_helpers.generate_absolute_path(owner, model_name_plural)
        im = Image.open(media_path + '/' + file_name_new)
        exif = models.Photo.read_exif_data(im)
        sizes = [1000, 500, 250, 128, 50, 20]
        photo_paths = [file_name_new]
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
            photo_paths.append('%s_%s%s' % (file_name, s, ext))
        
        return {
            'device': exif.get('model', None),
            'point': exif.get('point', None),
            'file_name_orig': file.name,
            'name': self.initial_data.get('name') or file.name,
            'file_name_new': file_name_new,
            'file_name_large': photo_paths[1],
            'file_name_medium': photo_paths[2],
            'file_name_medium_sm': photo_paths[3],
            'file_name_small': photo_paths[4],
            'file_name_marker_lg': photo_paths[5],
            'file_name_marker_sm': photo_paths[6],
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
            'attribution': validated_data.get('attribution') or owner.username,
            'host': settings.SERVER_HOST
        })
        data.update(validated_data)
        self.instance = self.Meta.model.objects.create(**data)
        return self.instance
    
class PhotoSerializerUpdate(PhotoSerializer):
    media_file = serializers.CharField(source='file_name_orig', required=False, read_only=True)
