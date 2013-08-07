from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.db.models.fields import Field
from localground.apps.site import widgets, models
from localground.apps.site.api import fields

class BaseSerializer(serializers.HyperlinkedModelSerializer):
	tags = fields.TagField(label='tags', required=False, widget=widgets.TagAutocomplete, help_text='Tag your object here')
	name = serializers.CharField(required=False, label='name')
	description = fields.DescriptionField(required=False, label='caption')
	overlay_type = serializers.SerializerMethodField('get_overlay_type')
		
	class Meta:
		fields = ('id', 'name', 'description', 'tags', 'overlay_type')
		
	def get_overlay_type(self, obj):
		return obj._meta.verbose_name
	
class PointSerializer(BaseSerializer):
	point = fields.PointField(help_text='Assign lat/lng field',
							  widget=widgets.PointWidgetTextbox,
							  required=False)
							  
	project_id = fields.ProjectField(source='project', required=False)
	
	class Meta:
		fields = BaseSerializer.Meta.fields + ('project_id', 'point')
		
class ExtentsSerializer(BaseSerializer):
	project_id = fields.ProjectField(label='project_id', source='project', required=False)
	center = fields.PointField(label='center', help_text='Assign lat/lng field',
							  widget=widgets.PointWidgetTextbox,
							  required=False)

	class Meta:
		fields = BaseSerializer.Meta.fields + ('project_id', 'center')
		
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
 
class MarkerSerializer(PointSerializer):
	photos = serializers.SerializerMethodField('get_photos')
	photo_links = serializers.SerializerMethodField('get_url_photos')
	audio_links = serializers.SerializerMethodField('get_url_audio')
	audio = serializers.SerializerMethodField('get_audio')
	color = fields.ColorField(required=False)
	point = fields.PointField(widget=widgets.PointWidgetTextbox, required=False)
	class Meta:
		model = models.Marker
		fields = PointSerializer.Meta.fields + \
			('photos', 'audio', 'color', 'photo_links', 'audio_links')
		depth = 0
		
	def _get_url_children(self, obj, model_name_plural):
		return '%s/api/0/%s/%s/%s/' % (settings.SERVER_URL,
					self.Meta.model.model_name_plural, obj.id,
					model_name_plural)
		
	def get_url_photos(self, obj):
		return self._get_url_children(obj, 'photos')
	
	def get_url_audio(self, obj):
		return self._get_url_children(obj, 'audio') 
	
	def serialize_nested_objects(self, id, Serializer, data, cls):
		serialized = []
		for item in data:
			d = Serializer(item).data
			d.update({
				'relation': '%s/api/0/%s/%s/%s/%s/' % (settings.SERVER_URL,
					'markers', id, cls.model_name_plural, item.id)    
			})
			serialized.append(d)
		return serialized
		
	def get_photos(self, obj):
		return {
			'id': models.Photo.model_name,
			'name': models.Photo.model_name_plural.title(),
			'overlay_type': models.Photo.model_name,
			'data': self.serialize_nested_objects(obj.id, PhotoSerializer, obj.photos, models.Photo)
		}
	
	def get_audio(self, obj):
		return {
			'id': models.Audio.model_name,
			'name': models.Audio.model_name_plural.title(),
			'overlay_type': models.Audio.model_name,
			'data': self.serialize_nested_objects(obj.id, AudioSerializer, obj.audio, models.Audio)
		}
	
class MarkerSerializerCounts(MarkerSerializer):
	photo_count = serializers.SerializerMethodField('get_photo_count')
	audio_count = serializers.SerializerMethodField('get_audio_count')
	point = fields.PointField(help_text='Assign lat/lng field',
							  widget=widgets.PointWidgetTextbox,
							  required=True) 
	class Meta:
		model = models.Marker
		fields = PointSerializer.Meta.fields + ('photo_count', 'audio_count',
									'color', 'photo_links', 'audio_links')
		depth = 0
		
	def get_photo_count(self, obj):
		try: return obj.photo_count
		except: return None
	
	def get_audio_count(self, obj):
		try: return obj.audio_count
		except: return None    
	
class AssociationSerializer(serializers.ModelSerializer):
	relation = serializers.SerializerMethodField('get_relation')
	id = serializers.IntegerField(source="entity_id", required=True)
		
	class Meta:
		model = models.EntityGroupAssociation
		fields = ('id', 'ordering', 'turned_on', 'relation')

	def validate(self, attrs):
		"""
		Ensure that the media being attached is legit
		"""
		from localground.apps.site.models import Base
		view = self.context.get('view')
		id = attrs.get('entity_id') or view.kwargs.get('id')
		try:
			id = int(id)
		except Exception:
			raise serializers.ValidationError('%s must be a whole number' % id)
		try:
			#get access to URL params throught the view
			cls = Base.get_model(
				model_name_plural=view.kwargs.get('entity_name_plural')
			)
		except:
			raise serializers.ValidationError(
				'\"%s\" is not a valid media type' % view.kwargs.get('entity_type')
			)
		try:
			cls.objects.get(id=id)
		except cls.DoesNotExist:
			raise serializers.ValidationError('%s #%s does not exist in the system' %
						(cls.model_name, id))
		return attrs

	def get_relation(self, obj):
		view = self.context.get('view')
		return '%s/api/0/%s/%s/%s/%s/' % (settings.SERVER_URL,
					view.kwargs.get('group_name_plural'), obj.group_id,
					view.kwargs.get('entity_name_plural'), obj.entity_id)
	
	
class AssociationSerializerDetail(AssociationSerializer):
	parent = serializers.SerializerMethodField('get_parent')
	child = serializers.SerializerMethodField('get_child')
	class Meta:
		model = models.EntityGroupAssociation
		fields = ('ordering', 'turned_on', 'parent', 'child')
		
	def get_parent(self, obj):
		view = self.context.get('view')
		return '%s/api/0/%s/%s/' % (settings.SERVER_URL,
					view.kwargs.get('group_name_plural'), obj.group_id)
	
	def get_child(self, obj):
		view = self.context.get('view')
		return '%s/api/0/%s/%s/' % (settings.SERVER_URL,
					view.kwargs.get('entity_name_plural'), obj.entity_id)
	
class WMSOverlaySerializer(serializers.HyperlinkedModelSerializer):
	
	class Meta:
		model = models.WMSOverlay
		fields = ( 'id', 'name', 'tags', 'overlay_type', 'overlay_source')
		depth = 0

class LayoutSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.Layout
		fields = ( 'id', 'name', 'display_name')
		depth = 0

class OverlayTypeSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.OverlayType
		fields = ( 'id', 'name')
		depth = 0
		
class OverlaySourceSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.OverlaySource
		fields = ( 'id', 'name')
		depth = 0


class PrintSerializer(ExtentsSerializer):
	layout_url = serializers.HyperlinkedRelatedField(view_name='layout-detail', source='layout', read_only=True)
	layout = serializers.SlugRelatedField(label='layout', slug_field='id')
	map_provider = serializers.SlugRelatedField(label='map_provider', slug_field='id')
	map_provider_url = serializers.HyperlinkedRelatedField(view_name='wmsoverlay-detail', source='map_provider', read_only=True)
	pdf = serializers.SerializerMethodField('get_pdf')
	thumb = serializers.SerializerMethodField('get_thumb')
	uuid = serializers.SerializerMethodField('get_uuid')
	instructions = serializers.WritableField(label='instructions', source='description', blank=True)
	map_title = serializers.WritableField(label='map_title', source='name', blank=True)
	
	class Meta:
		model = models.Print
		fields = ('id', 'uuid', 'project_id', 'map_title', 'instructions',
					'tags', 'overlay_type', 'pdf', 'thumb', 'zoom', 'map_provider',
					'map_provider_url', 'layout', 'layout_url', 'center')
		depth = 0
		
	def get_pdf(self, obj):
		return obj.pdf()
	
	def get_thumb(self, obj):
		return obj.thumb()
	
	def get_uuid(self, obj):
		return obj.uuid
	

