from localground.apps.site.api.serializers.base_serializer \
    import GeometrySerializer
from rest_framework import serializers
from django.conf import settings
from localground.apps.site import models
from localground.apps.site.api import fields
from django_hstore.dict import HStoreDict
import datetime
import json


def force_to_unicode(val):
    # For special characters:
    # https://gist.github.com/gornostal/1f123aaf838506038710
    if val is None:
        return val
    if isinstance(val, unicode):
        return val
    if isinstance(val, (datetime.datetime, datetime.date)):
        return val.isoformat().decode('utf8')
    if isinstance(val, (int, float)):
        return str(val).decode('utf8')
    else:
        return val.decode('utf8')


class ChoiceIntField(serializers.ChoiceField):

    def to_internal_value(self, data):
        if data is None:
            return None
        try:
            return int(data)
        except Exception:
            raise serializers.ValidationError(
                'One of the following integers is required: {0}'.format(
                    ', '.join([
                        '{0} ({1})'.format(
                            key, self.choices[key]
                        ) for key in self.choices.keys()
                    ])
                )
            )


class CustomDataTimeField(serializers.DateTimeField):
    def to_representation(self, obj):
        datetime_object = None
        # for fmt in ('%Y-%m-%dT%H:%M:%S', '%Y-%m-%d %H:%M:%S'):
        for fmt in settings.DATETIME_INPUT_FORMATS:
            try:
                datetime_object = datetime.datetime.strptime(obj, fmt)
            except ValueError:
                pass
        if datetime_object is not None:
            return str(datetime_object)
        raise ValueError('no valid date format found')


class RecordSerializerMixin(GeometrySerializer):
    # update_metadata = serializers.SerializerMethodField()
    # url = serializers.HyperlinkedIdentityField(
    '''
    Hack: can't use HyperlinkSerializer field for URLs with two
    dynamic parameters because of DRF limitations. So, we'll build
    the URL for ourselves:
    '''
    url = serializers.SerializerMethodField()
    dataset = serializers.SerializerMethodField()
    attached_photos_videos = serializers.SerializerMethodField()
    attached_map_images = serializers.SerializerMethodField()
    attached_audio = serializers.SerializerMethodField()

    def get_url(self, obj):
        return '%s/api/0/datasets/%s/data/%s' % \
                (settings.SERVER_URL, obj.dataset.id, obj.id)

    def get_dataset(self, obj):
        return self.dataset.id

    def get_overlay_type(self, obj):
        return 'dataset_{0}'.format(obj.dataset.id)

    def get_attached_photos_videos(self, obj):
        try:
            return obj.photo_video_list
        except Exception:
            return None

    def get_attached_map_images(self, obj):
        try:
            return obj.map_image_list
        except Exception:
            return None

    def get_attached_audio(self, obj):
        try:
            return obj.audio_list
        except Exception:
            return None

    class Meta:
        model = models.Record
        fields = GeometrySerializer.field_list + \
            ('dataset', 'extras', 'url', 'attached_photos_videos',
             'attached_map_images', 'attached_audio')
        depth = 0

    def _get_field_by_col_name(self, col_name):
        print self.dataset.fields
        for field in self.dataset.fields:
            print field.col_name, col_name
            if field.col_name == col_name:
                return field.unique_key
        raise exceptions.ValidationError(
            '{0} not found'.format(col_name)
        )

    def clean_attributes(self, attributes):
        cleaned = {}
        for key in attributes.keys():
            val = attributes[key]
            if isinstance(val, (datetime.datetime, datetime.date)):
                val = val.isoformat()
            cleaned[key] = val
        return HStoreDict(cleaned)

    def create(self, validated_data):
        # Override to handle HStore
        if 'attributes' in validated_data:
            validated_data['attributes'] = self.clean_attributes(
                validated_data['attributes'])
        validated_data.update(self.get_presave_create_dictionary())
        validated_data.update({
            'dataset': self.dataset,
            'project': self.dataset.project
        })
        self.instance = self.Meta.model.objects.create(**validated_data)
        return self.instance

    def update(self, instance, validated_data):
        from rest_framework.utils import model_meta
        validated_data.update(self.get_presave_update_dictionary())
        info = model_meta.get_field_info(instance)
        for attr, value in validated_data.items():
            if attr in info.relations and info.relations[attr].to_many:
                field = getattr(instance, attr)
                field.set(value)
            elif attr == 'attributes':
                # stringify all non-null attributes before DB commit:
                attribute_dict = value
                for prop in attribute_dict:
                    attribute_dict[prop] = \
                        force_to_unicode(attribute_dict[prop])
                instance.attributes.update(attribute_dict)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance


class RecordSerializer(RecordSerializerMixin):

    class Meta:
        fields = RecordSerializerMixin.Meta.fields


def create_dynamic_serializer(dataset, **kwargs):
    """
    generate a dynamic serializer from dynamic model
    """
    field_names = []

    for field in dataset.fields:
        field_names.append(field.col_name)

    class Meta:
        model = models.Record
        fields = RecordSerializerMixin.Meta.fields + \
            tuple(field_names)

    def createCharField(field):
        return serializers.CharField(
            source='attributes.' + field.unique_key,
            allow_null=True, required=False)

    # functions to create custom hstore fields
    def createIntField(field):
        return serializers.IntegerField(
            source='attributes.' + field.unique_key,
            allow_null=True, required=False)

    def createChoiceField(field):
        try:
            return serializers.ChoiceField(
                source='attributes.' + field.unique_key,
                choices=list(map(
                    lambda d: (d['name'], d['name']), field.extras['choices']
                )),
                allow_null=True, required=False)
        except Exception:
            print 'ERROR CREATING CHOICE FIELD'
            return createCharField(field)

    def createRatingField(field):
        # https://github.com/encode/django-rest-framework/issues/1755
        return ChoiceIntField(
            source='attributes.' + field.unique_key,
            choices=list(
                map(lambda d: (d['value'], d['name']), field.extras)
            ),
            allow_null=True, required=False)

    def createTextField(field):
        return serializers.CharField(
            source='attributes.' + field.unique_key,
            allow_null=True, allow_blank=True, required=False)

    def createDateTimeField(field):
        return CustomDataTimeField(
            source='attributes.' + field.unique_key,
            allow_null=True, required=False, format="iso-8601",
            input_formats=None)

    def createBooleanField(field):
        return serializers.NullBooleanField(
            source='attributes.' + field.unique_key, required=False)

    def createFloatField(field):
        return serializers.FloatField(
            source='attributes.' + field.unique_key,
            allow_null=True, required=False)

    attrs = {
        '__module__':
            'localground.apps.site.api.serializers.MarkerWAttrsSerializer',
        'Meta': Meta,
        'dataset': dataset
    }

    FieldTypes = {
        models.DataType.DataTypes.INTEGER: createIntField,
        models.DataType.DataTypes.TEXT: createTextField,
        models.DataType.DataTypes.DATETIME: createDateTimeField,
        models.DataType.DataTypes.BOOLEAN: createBooleanField,
        models.DataType.DataTypes.DECIMAL: createFloatField,
        models.DataType.DataTypes.RATING: createRatingField,
        models.DataType.DataTypes.CHOICE: createChoiceField
    }

    for field in dataset.fields:
        if field.data_type.id in FieldTypes:
            attrs.update({
                field.col_name: FieldTypes[field.data_type.id](field)
            })
        else:
            attrs.update({
                field.col_name: createCharField(field)
            })

    return type(
        'DynamicMarkerSerializer', (RecordSerializerMixin, ), attrs
    )
