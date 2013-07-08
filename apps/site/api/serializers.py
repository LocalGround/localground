from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.db.models.fields import Field
from localground.apps.site import widgets, models
from localground.apps.site.api import fields

class BaseSerializer(serializers.HyperlinkedModelSerializer):
    tags = fields.TagField(required=False, widget=widgets.TagAutocomplete, help_text='Tag your object here')
    name = serializers.CharField(required=False, label='name')
    attach_url = serializers.SerializerMethodField('get_attach_url')
    description = fields.DescriptionField(required=False, label='caption')
        
    class Meta:
        fields = ('id', 'name', 'description', 'tags', 'attach_url')
        
    def get_attach_url(self, obj):
        return '%s/api/0/%s/%s/attach/' % (settings.SERVER_URL, obj.model_name_plural, obj.id)

    
class PointSerializer(BaseSerializer):
    point = fields.PointField(widget=widgets.PointWidgetTextbox,
                              help_text='Tag your object here', required=False)
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
    color = fields.ColorField(required=False)
    point = fields.PointField(widget=widgets.PointWidgetTextbox, required=False)
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
    point = fields.PointField(widget=widgets.PointWidgetTextbox, required=True)
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
            'id': cls.model_name_plural,
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

    def get_group_object(self, obj):
        return obj.group_object
    
    def get_entity_object(self, obj):
        return obj.entity_object
    
        
    '''
    def validate(self, attrs):

        from localground.apps.site.models import Base
        object_name_plural = attrs.get('object_name_plural')
        cls = Base.get_model(model_name_plural=object_name_plural)
        try:
            #if obj found, raise an error...
            models.EntityGroupAssociation.objects.get(
                group_id=attrs.get('pk'),
                group_type=cls.get_content_type(),
                entity_id=attrs['entity_id'],
                entity_type=attrs['entity_type']
            )
            raise serializers.ValidationError("Constraint error")
        except Exception:
            pass
        
        return attrs
    '''
        
    '''
        ----------------------
        EntityGroupAssociation
        ----------------------
        ordering, turned_on, group_type, group_id, "group_object",
        entity_type, entity_id, "entity_object"
    '''
    
        