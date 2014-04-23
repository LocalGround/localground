from rest_framework import serializers
from django.contrib.gis.geos import GEOSGeometry, GEOSException
from django.contrib.gis.gdal import OGRException
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from localground.apps.site import models
import json


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
			ids = [int(id.strip()) for id in ids]
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
	
class PointField(serializers.WritableField):
	type_label = 'point'
	label = 'point'
		
	def field_from_native(self, data, files, field_name, into):
		try:
			lat, lng = data['lat'], data['lng']
		except KeyError:
			if self.required:
				raise serializers.ValidationError('Both a "lat" variable and a "lng" variable are required')
			return
		try:
			into[self.label] = self.to_point(lng, lat)
		except:
			value = None
			into[self.label] =  None
			#raise serializers.ValidationError('Invalid "lat" or "lng" parameter')
		
	def to_point(self, lng, lat):
		return GEOSGeometry('SRID=%s;POINT(%s %s)' % (4326, lng, lat))

	def to_native(self, obj):
		if obj is not None:
			return {
				'lng': obj.x,
				'lat': obj.y
			}
		

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
	type_name = 'GeometryField'
	geom_types = ['Point']
	
	def __init__(self, *args, **kwargs):
		if kwargs.get('geom_types'):
			self.geom_types = kwargs.pop('geom_types')
		super(GeometryField, self).__init__(*args, **kwargs)
	
	def field_from_native(self, data, files, field_name, into):
		if data.get('geometry') is not None:
			geom = self.from_native(data.get('geometry'))
			if geom.geom_type not in self.geom_types:
				raise serializers.ValidationError('Unsupported geometry type')
			
			#only one geom can exist at a time: Point, LineString, and Polygon
			# are mutually exclusive. Can't have more than one at once.
			if geom.geom_type == 'Point':
				into['point'] = geom
				into['polyline'] = None
				into['polygon'] = None
			elif geom.geom_type == 'LineString':
				into['polyline'] = geom
				into['point'] = None
				into['polygon'] = None
			elif geom.geom_type == 'Polygon':
				into['polygon'] = geom
				into['point'] = None
				into['polyline'] = None
			else:
				raise serializers.ValidationError('Unsupported geometry type')
	
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
	
'''
class EntitiesField(serializers.WritableField):

	type_name = 'EntitiesField'
	
	def field_from_native(self, data, files, field_name, into):
		if data.get('entities') is not None:
			entities = self.from_native(data.get('entities'))

			
			#only one geom can exist at a time: Point, LineString, and Polygon
			# are mutually exclusive. Can't have more than one at once.
			if geom.geom_type == 'Point':
				into['point'] = geom
				into['polyline'] = None
				into['polygon'] = None
			elif geom.geom_type == 'LineString':
				into['polyline'] = geom
				into['point'] = None
				into['polygon'] = None
			elif geom.geom_type == 'Polygon':
				into['polygon'] = geom
				into['point'] = None
				into['polyline'] = None
			else:
				raise serializers.ValidationError('Unsupported geometry type')
	
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
				return json.loads(entities)
			except (ValueError, GEOSException, OGRException, TypeError) as e:
				raise serializers.ValidationError(_('Invalid format: string or unicode input unrecognized JSON format.'))
			return value
		return None
'''

