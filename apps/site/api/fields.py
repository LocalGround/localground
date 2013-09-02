from rest_framework import serializers
from django.contrib.gis.geos import GEOSGeometry
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from localground.apps.site import models

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
	
class PointField(serializers.WritableField):
	type_label = 'point'
	label = 'point'
	def field_from_native(self, data, files, field_name, into):
		try:
			native = '%s;%s' % (data['lng'], data['lat'])
			#native = '%s;%s' % (data['%s_lng' % self.type_label], data['%s_lat' % self.type_label])
		except KeyError:
			if self.required:
				raise serializers.ValidationError('Both a "lat" variable and a "lng" variable are required')
			return
		try:
			value = self.to_point(native)
			into[self.label] =  self.to_point(native)
		except:
			raise serializers.ValidationError('Invalid "lat" or "lng" parameter')
		
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
	
class AttachedHyperlinkedField(serializers.HyperlinkedRelatedField):
	'''
	def get_url(self, obj, view_name, request, format):
		kwargs = {'object_type_plural': obj.class_name_plural, 'pk': obj.pk}
		return reverse(view_name, kwargs=kwargs, request=request, format=format)
	
	def get_object(self, queryset, view_name, view_args, view_kwargs):
		object_type_plural = view_kwargs['object_type_plural']
		pk = view_kwargs['pk']
		return queryset.get(id=pk)
	'''
	pass
	