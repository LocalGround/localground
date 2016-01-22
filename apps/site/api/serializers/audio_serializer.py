import os
from django.conf import settings
from localground.apps.site.api.serializers.base_serializer import MediaGeometrySerializer, GeometrySerializer
from localground.apps.site.api.fields import FileField
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.lib.helpers import get_timestamp_no_milliseconds, upload_helpers


class AudioSerializer(MediaGeometrySerializer):
    ext_whitelist = ['m4a', 'mp3', 'mp4', 'mpeg', '3gp', 'aif', 'aiff', 'ogg', 'wav']
    file_path = serializers.SerializerMethodField('get_file_path_new')
    media_file = serializers.CharField(
        source='file_name_orig', required=True, style={'base_template': 'file.html'},
        help_text='Valid file types are: ' + ', '.join(ext_whitelist)
    )
    
    def process_file(self, file, owner):
        
        #save to disk:
        model_name_plural = models.Audio.model_name_plural
        file_name_new = upload_helpers.save_file_to_disk(owner, model_name_plural, file)
        file_name, ext = os.path.splitext(file_name_new)
        
        # convert to MP3:
        if ext != '.mp3':
            # use ffmpeg to convert to mp3:
            media_path = upload_helpers.generate_absolute_path(owner, model_name_plural)
            path_to_be_converted = media_path + '/' + file_name_new
            file_name_new = file_name + '.mp3'
            path_to_mp3 = media_path + '/' + file_name_new
            command = 'ffmpeg -loglevel panic -i \'%s\' -ab 32k -ar 22050 -y \'%s\'' % \
                (path_to_be_converted, path_to_mp3)
            result = os.popen(command)
        
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
        extras = self.process_file(f, owner)
        extras.update(self.get_presave_create_dictionary())
        extras.update({
            'attribution': validated_data.get('attribution') or owner.username,
            'host': settings.SERVER_HOST
        })
        validated_data = {}
        validated_data.update(self.validated_data)
        validated_data.update(extras)
        self.instance = self.Meta.model.objects.create(**validated_data)
        return self.instance

    class Meta:
        model = models.Audio
        fields = MediaGeometrySerializer.Meta.fields + \
            ('file_path', )
        depth = 0

    def get_file_path_new(self, obj):
        return obj.encrypt_url(obj.file_name_new)


class AudioSerializerUpdate(AudioSerializer):
    media_file = serializers.CharField(source='file_name_orig', required=False, read_only=True)

