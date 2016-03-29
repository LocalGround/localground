from rest_framework import serializers, relations
from django.contrib.gis.geos import GEOSGeometry, GEOSException
from django.contrib.gis.gdal import OGRException
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from localground.apps.site import models
from sys import stderr
import json
from localground.apps.site.api.fields.geometry import GeometryField
from localground.apps.site.api.fields.table_media import TablePhotoJSONField, TableAudioJSONField
from localground.apps.site.api.fields.model_field import CustomModelField
from localground.apps.site.api.fields.json_fields import EntitiesField, JSONField
from localground.apps.site.api.fields.list_field import ListField

class UrlField(relations.HyperlinkedIdentityField):

    def get_url(self, obj, view_name, request, format):
        url = super(UrlField, self).get_url(obj, view_name, request, format)
        if request and request.GET.get('access_key'):
            url += '?access_key=%s' % request.GET.get('access_key')
        return url


class OwnerField(serializers.Field):

    def to_representation(self, obj):
        return obj.id

    def to_internal_value(self, data):
        return User.objects.get(id=int(data))


class ColorField(serializers.CharField):
    type_label = 'color'


class ProjectField(serializers.Field):
    type_label = 'select'

    def to_representation(self, obj):
        return obj.id

    def to_internal_value(self, data):
        id = None
        try:
            id = int(data)
        except:
            raise serializers.ValidationError("Project ID must be an integer")
        try:
            return models.Project.objects.get(id=id)
        except models.Project.DoesNotExist:
            raise serializers.ValidationError(
                "Project ID \"%s\" does not exist" %
                data)
        except:
            raise serializers.ValidationError(
                "project_id=%s is invalid" %
                data)
    
    
    def metadata(self):
        metadata = super(ProjectField, self).metadata()
        try:
            user = self.context['request'].user
            projects = models.Project.objects.get_objects(user).order_by('id')
            opts = []
            for project in projects:
                opts.append([
                    '{0} - {1}'.format(project.id, project.name),
                    project.id 
                ])
            metadata["optionValues"] = opts
        except:
            pass
        return metadata



class ProjectsField(serializers.Field):
    type_label = 'integer'

    def to_representation(self, obj):
        return ', '.join([str(p.id) for p in obj.all()])

    def to_internal_value(self, data):
        try:
            ids = data.split(',')
            ids = [int(id.strip()) for id in ids]
        except:
            raise serializers.ValidationError(
                "Project IDs must be a list of comma-separated integers")
        return [models.Project.objects.get(id__in=ids)]
        try:
            return [models.Project.objects.get(id__in=ids)]
        except models.Project.DoesNotExist:
            raise serializers.ValidationError(
                "Project IDs \"%s\" do not exist" %
                data)
        except:
            raise serializers.ValidationError(
                "project_ids=%s is invalid" %
                ids)
        return [models.Project.objects.get(id__in=ids)]
        


class FileField(serializers.CharField):
    type_label = 'file'
    label = 'file_name'

    def get_value(self, data, files, field_name, into):
        try:
            if files.get(self.source):
                value = files.get(self.source).name
                into[self.source] = value
        except:
            value = None
            into[self.source] = value

    def to_representation(self, obj):
        return obj


class EntityTypeField(serializers.ChoiceField):
    # name='entity'
    choices = [
        ('photo', 'photo'),
        ('audio', 'audio'),
        ('marker', 'marker')
    ]

    def to_representation(self, obj):
        return obj.model

    def to_internal_value(self, data):
        from localground.apps.site.models import Base

        cls = Base.get_model(model_name=data)
        return cls.get_content_type()

    def valid_value(self, value):
        """
        Override this b/c not working correctly in rest_framework lib
        """
        return True
