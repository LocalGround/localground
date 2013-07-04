from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.db.models.fields import Field
from localground.apps.site import widgets, models
from localground.apps.site.api import fields

class BaseSerializer(serializers.HyperlinkedModelSerializer):
    tags = serializers.CharField(required=False, widget=widgets.TagAutocomplete, help_text='Tag your object here')
    name = serializers.WritableField(required=False)
    attach_url = serializers.SerializerMethodField('get_attach_url')
    #managers = ('photos', 'audio', 'markers')
    #owner_id = fields.OwnerField(source='owner', required=False)
    #attach_url = serializers.HyperlinkedIdentityField(view_name='photos-attach', lookup_field='pk')
    
    class Meta:
        fields = ('id', 'name', 'description', 'tags', 'attach_url')
        
    def get_attach_url(self, obj):
        return '%s/api/0/%s/%s/attach/' % (settings.SERVER_URL, obj.model_name_plural, obj.id)
    
    '''
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
            try:
                if key in ProjectDetailSerializer.managers:
                    value = {
                        'id': key,
                        'name': key.title(),
                        'overlay_type': field.Meta.model.model_name,
                        'data': value  
                    }
            except:
                pass
            ret[key] = value
            ret.fields[key] = field
        return ret
    '''
    
class PointSerializer(BaseSerializer):
    point = fields.PointField(widget=widgets.PointWidgetTextbox, help_text='Tag your object here')
    project_id = fields.ProjectField(source='project', required=False)
    overlay_type = serializers.SerializerMethodField('get_overlay_type')
    
    class Meta:
        fields = BaseSerializer.Meta.fields + ('project_id', 'point',
                                                    'overlay_type')

    def get_overlay_type(self, obj):
        return obj._meta.verbose_name

class MediaPointSerializer(PointSerializer):
    file_name = serializers.Field(source='file_name_new')
    caption = serializers.Field(source='description')
    
    class Meta:
        fields = PointSerializer.Meta.fields + ('attribution',
                            'file_name', 'caption')
    
class PhotoSerializer(MediaPointSerializer):
    path_large = serializers.SerializerMethodField('get_path_large')
    path_medium = serializers.SerializerMethodField('get_path_medium')
    path_medium_sm = serializers.SerializerMethodField('get_path_medium_sm')
    path_small = serializers.SerializerMethodField('get_path_small')
    path_marker_lg = serializers.SerializerMethodField('get_path_marker_lg')
    path_marker_sm = serializers.SerializerMethodField('get_path_path_marker_sm')
    overlay_type = serializers.SerializerMethodField('get_overlay_type')

    class Meta:
        model = models.Photo
        fields = MediaPointSerializer.Meta.fields + (
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

class AudioSerializer(MediaPointSerializer):
    file_path = serializers.SerializerMethodField('get_file_path')
    
    class Meta:
        model = models.Audio
        fields = MediaPointSerializer.Meta.fields  + ('file_path',)
        depth = 0
        
    def get_file_path(self, obj):
        return obj.encrypt_url(obj.file_name_new)
    
class MarkerSerializer(PointSerializer):
    photos = serializers.SerializerMethodField('get_photos')
    audio = serializers.SerializerMethodField('get_audio')
    color = serializers.WritableField(default='CCCCCC')
    class Meta:
        model = models.Marker
        fields = PointSerializer.Meta.fields + ('photos', 'audio', 'color',)
        depth = 0
        
    def get_photos(self, obj):
        return {
            'id': models.Photo.model_name,
            'name': models.Photo.model_name_plural.title(),
            'overlay_type': models.Photo.model_name,
            'data': [PhotoSerializer(p).data for p in obj.photos]
        }
    
    def get_audio(self, obj):
        return {
            'id': models.Audio.model_name,
            'name': models.Audio.model_name_plural.title(),
            'overlay_type': models.Audio.model_name,
            'data': [AudioSerializer(a).data for a in obj.audio]
        }
    
class MarkerSerializerCounts(MarkerSerializer):
    photo_count = serializers.SerializerMethodField('get_photo_count')
    audio_count = serializers.SerializerMethodField('get_audio_count')
    class Meta:
        model = models.Marker
        fields = PointSerializer.Meta.fields + ('photo_count', 'audio_count', 'color',)
        depth = 0
        
    def get_photo_count(self, obj):
        try: return obj.photo_count
        except: return None
    
    def get_audio_count(self, obj):
        try: return obj.audio_count
        except: return None
    

        
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
        model = models.Project
        fields = BaseSerializer.Meta.fields + ('owner', 'slug')
        read_only_fields = ('owner',)
        depth = 0
        
class ProjectDetailSerializer(BaseSerializer):
    #photos = PhotoSerializer(many=True, read_only=True, source='photo')
    #audio = AudioSerializer(many=True, read_only=True, source='audio')
    #markers = MarkerSerializer(many=True, read_only=True, source='marker_set')
    photos = serializers.SerializerMethodField('get_photos')
    audio = serializers.SerializerMethodField('get_audio')
    markers = serializers.SerializerMethodField('get_markers')
    
    class Meta:
        model = models.Project
        fields = BaseSerializer.Meta.fields + ('slug', 'photos', 'audio', 'markers')
        depth = 0
        
    def get_photos(self, obj):
        data = PhotoSerializer(
                models.Photo.objects.get_objects(obj.owner, project=obj)
            ).data
        return self.get_children(models.Photo, obj, data)    
    
    def get_audio(self, obj):
        data = AudioSerializer(
                models.Audio.objects.get_objects(obj.owner, project=obj)
            ).data
        return self.get_children(models.Audio, obj, data)
    
    def get_markers(self, obj):
        data = MarkerSerializerCounts(
                models.Marker.objects.get_objects_with_counts(obj.owner, project=obj)
            ).data
        return self.get_children(models.Marker, obj, data)
    
    def get_children(self, cls, obj, data):
        return {
            'id': cls.model_name,
            'name': cls.model_name_plural.title(),
            'overlay_type': cls.model_name,
            'data': data
        }
     
    
class AssociationSerializer(serializers.ModelSerializer):
    entity_object = serializers.SerializerMethodField('get_entity_object')
    entity_type = fields.EntityTypeField(source='entity_type', required=True,
                                  choices=[
                                    ('photo','photo'),
                                    ('audio', 'audio'),
                                    ('marker', 'marker')
                                    ])
    group_object = serializers.SerializerMethodField('get_group_object')
    id = serializers.WritableField(source="entity_id", required=True)
        
    class Meta:
        model = models.EntityGroupAssociation
        fields = ('ordering', 'turned_on', 'entity_type', 'entity_object',
                    'group_object', 'id')
        depth = 2

    def get_group_object(self, obj):
        return obj.group_object
    
    def get_entity_object(self, obj):
        return obj.entity_object
        
        '''
        ----------------------
        EntityGroupAssociation
        ----------------------
        ordering, turned_on, group_type, group_id, "group_object",
        entity_type, entity_id, "entity_object"
        '''
    
        