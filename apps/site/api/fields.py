from rest_framework import serializers
from django.contrib.gis.geos import GEOSGeometry, GEOSException
from django.contrib.gis.gdal import OGRException
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from localground.apps.site import models
import json
from django.core.exceptions import ValidationError


class OwnerField(serializers.WritableField):
	def to_native(self, obj):
		return obj.id

	def from_native(self, data):
		return User.objects.get(id=int(data))

class ColorField(serializers.WritableField):
	type_label='color'
	
class DescriptionField(serializers.WritableField):
	type_label='memo'
	
class TagField(serializers.WritableField):
	type_label='tags'
	
class ProjectField(serializers.WritableField):
	type_label='integer'
	
	def to_native(self, obj):
		return obj.id

	def from_native(self, data):
		id = None
		try:
			id = int(data)
		except:
			raise serializers.ValidationError("Project ID must be an integer")
		try:
			return models.Project.objects.get(id=id)
		except models.Project.DoesNotExist:
			raise serializers.ValidationError("Project ID \"%s\" does not exist" % data)
		except:
			raise serializers.ValidationError("project_id=%s is invalid" % data)
	
class ProjectsField(serializers.WritableField):
	type_label='integer'
	
	def to_native(self, obj):
		return ', '.join([str(p.id) for p in obj.all()])

	def from_native(self, data):
		ids = None
		try:
			ids = data.split(',')
			ids = [int(child_id.strip()) for child_id in ids]
		except:
			raise serializers.ValidationError("Project IDs must be a list of comma-separated integers")
		try:
			return [ models.Project.objects.get(id__in=ids) ]
		except models.Project.DoesNotExist:
			raise serializers.ValidationError("Project IDs \"%s\" do not exist" % data)
		except:
			raise serializers.ValidationError("project_ids=%s is invalid" % data)
		
class FileField(serializers.CharField):
	type_label = 'file'
	label = 'file_name'
	
	def field_from_native(self, data, files, field_name, into):
		try:
			if files.get(self.source):
				value = files.get(self.source).name
				into[self.source] = value
		except:
			value = None
			into[self.source] = value   
		
		
	def to_native(self, obj):
		return obj

class EntityTypeField(serializers.ChoiceField):
	#name='entity'
	choices = [
		('photo','photo'),
		('audio', 'audio'),
		('marker', 'marker')
		]
	def to_native(self, obj):
		return obj.model

	def from_native(self, data):
		from localground.apps.site.models import Base
		cls = Base.get_model(model_name=data)
		return cls.get_content_type()
	
	def valid_value(self, value):
		"""
		Override this b/c not working correctly in rest_framework lib
		"""
		return True

class GeometryField(serializers.WritableField):
	"""
	A field to handle GeoDjango Geometry fields
	"""
	type_label = 'geojson'
	type_name = 'GeometryField'
	geom_types = ['Point']
	point_field_name = 'point'
	polyline_field_name = 'polyline'
	polygon_field_name = 'polygon'
	
	def __init__(self, *args, **kwargs):
		if kwargs.get('geom_types'):
			self.geom_types = kwargs.pop('geom_types')
		if kwargs.get('point_field_name'):
			self.point_field_name = kwargs.pop('point_field_name')
		if kwargs.get('polyline_field_name'):
			self.polyline_field_name = kwargs.pop('polyline_field_name')
		if kwargs.get('polygon_field_name'):
			self.polygon_field_name = kwargs.pop('polygon_field_name')
		super(GeometryField, self).__init__(*args, **kwargs)
	
	def field_from_native(self, data, files, field_name, into):
		if data.get(field_name) is not None and \
		data.get(field_name) != '':
			geom = self.from_native(data.get(field_name))
			if geom.geom_type not in self.geom_types:
				raise serializers.ValidationError('Unsupported geometry type')
			
			#only one geom can exist at a time: Point, LineString, and Polygon
			# are mutually exclusive. Can't have more than one at once.
			if geom.geom_type == 'Point':
				point, polyline, polygon = geom, None, None
			elif geom.geom_type == 'LineString':
				point, polyline, polygon = None, geom, None
			elif geom.geom_type == 'Polygon':
				point, polyline, polygon = None, None, geom
			else:
				raise serializers.ValidationError('Unsupported geometry type')
			
			if 'Point' in self.geom_types:
				into[self.point_field_name] = point
			if 'LineString' in self.geom_types:
				into[self.polyline_field_name] = polyline
			if 'Polygon' in self.geom_types:
				into[self.polygon_field_name] = polygon
	
	def to_native(self, value):
		if value is not None:
			if isinstance(value, dict) or value is None:
				return value
			# Get GeoDjango geojson serialization and then convert it _back_ to
			# a Python object
			return json.loads(value.geojson)
		

	def from_native(self, value):
		if value is not None:
			try:
				return GEOSGeometry(value)
			except (ValueError, GEOSException, OGRException, TypeError) as e:
				raise serializers.ValidationError(_('Invalid format: string or unicode input unrecognized as WKT EWKT, and HEXEWKB.'))
		
			return value
		return None
		
		
class EntitiesField(serializers.WritableField):
	type_label = 'json'
	type_name = 'EntitiesField'
	
	def field_from_native(self, data, files, field_name, into):
		'''
		Alas, this doesn't cover it...only does most of the validation.
		To execute the actual database commit, you need to implement code
		in the view. Please see "views_view" for details. A total hack.
		'''
		import json
		entities_str = data.get('entities')
		if entities_str:
			try:
				entities = json.loads(entities_str)
			except:
				raise serializers.ValidationError('Error parsing JSON')
			
			for child in entities:
				# validate each dictionary entry:
				try:
					overlay_type = child['overlay_type']
					ids = child['ids']
				except:
					raise serializers.ValidationError(
						'%s must have an overlay_type and an ids attribute' % child
					)
				if not isinstance(ids, list):
					raise serializers.ValidationError(
						'%s must be a list' % ids
					)
				
				for entity_id in ids:
					# ensure that the requested child item exists:
					from localground.apps.site.models import Base
					try:
						obj = Base.get_model(
									model_name=overlay_type
								).objects.get(id=entity_id)
					except:
						raise serializers.ValidationError(
							'No %s object exists with id=%s' % (overlay_type, entity_id)
						)
	
	def to_native(self, value):
		if value is not None:
			entity_dict = {}
			for e in value.all():
				overlay_type = e.entity_type.name
				if entity_dict.get(overlay_type) is None:
					entity_dict[overlay_type] = []
				entity_dict[overlay_type].append(e.entity_id)
			
			entry_list = []	
			for key in entity_dict:
				entry_list.append({
					'overlay_type': key,
					'ids': entity_dict[key]
				})
			return entry_list
		
class JSONField(serializers.WritableField):
	type_label = 'json'
	type_name = 'JSONField'
	
	def from_native(self, data):
		try:
			json.loads(data)
		except:
			raise serializers.ValidationError('Error parsing JSON')
		return data
	
	def to_native(self, value):
		if value is not None:
			if value is None or isinstance(value, dict) or isinstance(value, list):
				return value
			return json.loads(value)

