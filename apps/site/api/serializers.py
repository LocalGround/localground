from django.forms import widgets
from rest_framework import serializers
from localground.apps.site.models import Photo, Audio, Project
from django.contrib.auth.models import User, Group
from django.db.models.fields import Field
from localground.apps.site.widgets import TagAutocomplete, PointWidgetHidden, PointWidgetTextbox
from django.contrib.gis.geos import GEOSGeometry
from django.core.exceptions import ValidationError

class OwnerField(serializers.WritableField):
    def to_native(self, obj):
        return obj.id

    def from_native(self, data):
        return User.objects.get(id=int(data))
    
class PointField(serializers.WritableField):
    def field_from_native(self, data, files, field_name, into):
        try:
            native = '%s;%s' % (data['lng'], data['lat'])
        except KeyError:
            if self.required:
                raise ValidationError('Both a "lat" variable and a "lng" variable are required')
            return
        try:
            value = self.to_point(native)
            into['point'] =  self.to_point(native)
        except:
            raise Exception('Invalid "lat" or "lng" parameter')
        
    def to_point(self, data):
        lng_lat = data.split(';')
        lng, lat = lng_lat[0], lng_lat[1]
        return GEOSGeometry('SRID=%s;POINT(%s %s)' % (4326, lng, lat))

    def to_native(self, obj):
        if obj is not None:
            return {
                'lng': obj.x,
                'lat': obj.y
            }

class BaseSerializer(serializers.HyperlinkedModelSerializer):
    owner_id = OwnerField(source='owner', required=False)
    tags = serializers.CharField(required=False, widget=TagAutocomplete, help_text='Tag your object here')
    fields = ('id', 'name', 'description', 'tags', 'owner_id')
    
class PointOverlaySerializer(BaseSerializer):
    point = PointField(widget=PointWidgetTextbox, help_text='Tag your object here')
    project_id = serializers.Field(source='project.id')
    file_name = serializers.Field(source='file_name_new')
    caption = serializers.Field(source='description')
    overlay_type = serializers.SerializerMethodField('get_overlay_type')
    
    fields = BaseSerializer.fields + ('project_id', 'attribution',
                            'file_name', 'caption', 'overlay_type', 'point')

    def get_overlay_type(self, obj):
        return obj._meta.verbose_name



class PhotoSerializer(PointOverlaySerializer):
    path_large = serializers.SerializerMethodField('get_path_large')
    path_medium = serializers.SerializerMethodField('get_path_medium')
    path_medium_sm = serializers.SerializerMethodField('get_path_medium_sm')
    path_small = serializers.SerializerMethodField('get_path_small')
    path_marker_lg = serializers.SerializerMethodField('get_path_marker_lg')
    path_marker_sm = serializers.SerializerMethodField('get_path_path_marker_sm')
    overlay_type = serializers.SerializerMethodField('get_overlay_type')

    class Meta:
        model = Photo
        fields = PointOverlaySerializer.fields + (
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

class AudioSerializer(PointOverlaySerializer):
    file_path = serializers.SerializerMethodField('get_file_path')
    
    class Meta:
        model = Audio
        fields = PointOverlaySerializer.fields  + ('file_path',)
        depth = 0
        
    def get_file_path(self, obj):
        return obj.encrypt_url(obj.file_name_new)
        
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
        fields = BaseSerializer.fields + ('owner', 'slug')
        read_only_fields = ('owner',)
        depth = 1
        
class ProjectDetailSerializer(BaseSerializer):
    photos = PhotoSerializer(many=True, read_only=True, source='photo')
    audio = AudioSerializer(many=True, read_only=True, source='audio')
    managers = ('photos', 'audio')
    
    class Meta:
        model = Project
        fields = BaseSerializer.fields + ('slug', 'photos', 'audio')
        depth = 1
        
    def to_native(self, obj):
        """
        Overriding rest_framework.serializers.BaseSerializer's to_native
        method in order to custom-serialize child media
        """
        ret = self._dict_class()
        ret.fields = {}

        for field_name, field in self.fields.items():
            field.initialize(parent=self, field_name=field_name)
            key = self.get_field_key(field_name)
            value = field.field_to_native(obj, field_name)
            if key in ProjectDetailSerializer.managers:
                value = {
                    'id': key,
                    'name': key.title(),
                    'overlay_type': field.Meta.model._meta.verbose_name,
                    'data': value  
                }
            ret[key] = value
            ret.fields[key] = field
        return ret
        