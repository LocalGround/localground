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

class UrlField(relations.HyperlinkedIdentityField):

    def get_url(self, obj, view_name, request, format):
        url = super(UrlField, self).get_url(obj, view_name, request, format)
        if request and request.GET.get('access_key'):
            url += '?access_key=%s' % request.GET.get('access_key')
        return url


class OwnerField(serializers.WritableField):

    def to_native(self, obj):
        return obj.id

    def from_native(self, data):
        return User.objects.get(id=int(data))


class ColorField(serializers.WritableField):
    type_label = 'color'


class DescriptionField(serializers.WritableField):
    type_label = 'memo'


class TagField(serializers.WritableField):
    type_label = 'tags'


class ProjectField(serializers.WritableField):
    type_label = 'project'

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
            raise serializers.ValidationError(
                "Project ID \"%s\" does not exist" %
                data)
        except:
            raise serializers.ValidationError(
                "project_id=%s is invalid" %
                data)


class ProjectsField(serializers.WritableField):
    type_label = 'integer'

    def to_native(self, obj):
        return ', '.join([str(p.id) for p in obj.all()])

    def from_native(self, data):
        ids = None
        try:
            ids = data.split(',')
            ids = [int(child_id.strip()) for child_id in ids]
        except:
            raise serializers.ValidationError(
                "Project IDs must be a list of comma-separated integers")
        try:
            return [models.Project.objects.get(id__in=ids)]
        except models.Project.DoesNotExist:
            raise serializers.ValidationError(
                "Project IDs \"%s\" do not exist" %
                data)
        except:
            raise serializers.ValidationError(
                "project_ids=%s is invalid" %
                data)


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
    # name='entity'
    choices = [
        ('photo', 'photo'),
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
                    #innerEntities = child['entities']
                    ids = child['ids']
                except:
                    raise serializers.ValidationError(
                        '%s must have an overlay_type and an ids attribute' %
                        child)
                if not isinstance(ids, list):
                    raise serializers.ValidationError(
                        '%s must be a list' % ids
                    )
                '''
				#Zack code...
				if not isinstance(innerEntities, list):
					raise serializers.ValidationError(
						'%s must be a list' % innerEntities
					)
				'''

                # for entity in innerEntities:
                for id in ids:
                    # ensure that the requested child item exists:
                    from localground.apps.site.models import Base

                    try:
                        obj = Base.get_model(
                            model_name=overlay_type
                        ).objects.get(id=id)
                        # entity['id']
                    except:
                        raise serializers.ValidationError(
                            'No %s object exists with id=%s' % (
                                overlay_type,
                                id)  # entity['id'])
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
                    'entities': entity_dict[key]
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
            if value is None or isinstance(
                    value,
                    dict) or isinstance(
                    value,
                    list):
                return value
            return json.loads(value)
