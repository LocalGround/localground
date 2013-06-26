from django.forms import widgets
from rest_framework import serializers
from localground.apps.site.models import Photo, Audio, Project
from django.contrib.auth.models import User, Group
from django.db.models.fields import Field
from localground.apps.site.widgets import TagAutocomplete


class BaseSerializer(serializers.HyperlinkedModelSerializer):
    class OwnerField(serializers.WritableField):
        """
        Color objects are serialized into "rgb(#, #, #)" notation.
        """
        def to_native(self, obj):
            return obj.id
    
        def from_native(self, data):
            return User.objects.get(id=int(data))
        
        
    owner_id = OwnerField(source='owner')
    tags = serializers.CharField(widget=TagAutocomplete, help_text='Tag your object here')
    
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
        
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('name', )
        
class ProjectSerializer(BaseSerializer):
    
    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'tags', 'owner', 'owner_id', 'slug')
        read_only_fields = ('owner',)
        exclude = ('last_updated_by',)
        depth = 1
        