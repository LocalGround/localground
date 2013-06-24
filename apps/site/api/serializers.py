from django.forms import widgets
from rest_framework import serializers
from localground.apps.site.models import Photo, Audio, Project
from django.db.models.fields import Field

class BaseSerializer(serializers.HyperlinkedModelSerializer):
    owner_id = serializers.Field(source='owner.username')
    project_id = serializers.Field(source='project.id')
    file_name = serializers.Field(source='file_name_new')
    caption = serializers.Field(source='description')
    lat = serializers.SerializerMethodField('get_lat')
    lng = serializers.SerializerMethodField('get_lng')
    
    fields = ('id', 'name', 'description', 'tags', 'owner_id', 'project_id', 
                    'attribution', 'file_name', 'caption', 'lat', 'lng')
    
    def get_lat(self, obj):
        if obj.point is not None:
            return obj.point.y
        return None
        
    def get_lng(self, obj):
        if obj.point is not None:
            return obj.point.x
        return None


class PhotoSerializer(BaseSerializer):
    path_large = serializers.SerializerMethodField('get_path_large')
    path_medium = serializers.SerializerMethodField('get_path_medium')
    path_medium_sm = serializers.SerializerMethodField('get_path_medium_sm')
    path_small = serializers.SerializerMethodField('get_path_small')
    path_marker_lg = serializers.SerializerMethodField('get_path_marker_lg')
    path_marker_sm = serializers.SerializerMethodField('get_path_path_marker_sm')

    class Meta(BaseSerializer.Meta):
        model = Photo
        fields = BaseSerializer.fields + (
                    'path_large', 'path_medium', 'path_medium_sm',
                    'path_small', 'path_marker_lg', 'path_marker_sm'
                )
        depth = 1
    
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
    
    def get_path_path_marker_sm(self, obj):
        return obj.encrypt_url(obj.file_name_marker_sm)

class AudioSerializer(BaseSerializer):
    
    class Meta(BaseSerializer.Meta):
        model = Audio
        fields = BaseSerializer.fields
        depth = 1
             
class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'tags', 'owner')
        depth = 1
        