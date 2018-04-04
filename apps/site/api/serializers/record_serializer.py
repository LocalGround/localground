from localground.apps.site.api.serializers.base_serializer \
    import GeometrySerializer
from rest_framework import serializers
from django.conf import settings
from rest_framework.reverse import reverse
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings
from django_hstore.dict import HStoreDict
from rest_framework.settings import api_settings
import datetime
import json

from rest_framework import serializers


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
        datetime_object = datetime.datetime.strptime(obj, '%Y-%m-%dT%H:%M:%S')
        return str(datetime_object)


class RecordSerializerMixin(GeometrySerializer):
    # update_metadata = serializers.SerializerMethodField()
    # url = serializers.HyperlinkedIdentityField(
    '''
    Hack: can't use HyperlinkSerializer field for URLs with two
    dynamic parameters because of DRF limitations. So, we'll build
    the URL for ourselves:
    '''
    url = serializers.SerializerMethodField()

    form = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()
    attached_photos_ids = serializers.SerializerMethodField()
    attached_audio_ids = serializers.SerializerMethodField()
    attached_videos_ids = serializers.SerializerMethodField()
    attached_map_images_ids = serializers.SerializerMethodField()

    project_id = serializers.PrimaryKeyRelatedField(
        source='project',
        required=False,
        read_only=True
    )

    def get_url(self, obj):
        return '%s/api/0/datasets/%s/data/%s' % \
                (settings.SERVER_URL, obj.form.id, obj.id)

    def get_form(self, obj):
        return self.form.id

    def get_overlay_type(self, obj):
        return 'form_{0}'.format(obj.form.id)

    def get_media(self, obj):
        from django.contrib.contenttypes.models import ContentType
        from localground.apps.site import models

        media = {}
        self.audio = self.get_audio(obj) or []
        self.photos = self.get_photos(obj) or []
        self.videos = self.get_videos(obj) or []
        self.map_images = self.get_map_images(obj) or []
        if self.audio:
            media['audio'] = self.audio
        if self.photos:
            media['photos'] = self.photos
        if self.videos:
            media['videos'] = self.videos
        if self.map_images:
            media['map_images'] = self.map_images

        return media

    def get_photos(self, obj):
        from localground.apps.site.api.serializers import PhotoSerializer

        data = PhotoSerializer(
            obj.photos,
            many=True, context={'request': {}}).data
        return self.serialize_list(obj, models.Photo, data)

    def get_videos(self, obj):
        from localground.apps.site.api.serializers import VideoSerializer

        data = VideoSerializer(
            obj.videos,
            many=True, context={'request': {}}).data
        return self.serialize_list(obj, models.Video, data)

    def get_audio(self, obj):
        from localground.apps.site.api.serializers import AudioSerializer

        data = AudioSerializer(
            obj.audio,
            many=True, context={'request': {}}).data
        return self.serialize_list(obj, models.Audio, data)

    def get_map_images(self, obj):
        from localground.apps.site.api.serializers import \
            MapImageSerializerUpdate

        data = MapImageSerializerUpdate(
            obj.map_images,
            many=True, context={'request': {}}).data
        return self.serialize_list(obj, models.MapImage, data)

    def get_attached_photos_ids(self, obj):
        try:
            return obj.photo_array
        except Exception:
            return None

    def get_attached_audio_ids(self, obj):
        try:
            return obj.audio_array
        except Exception:
            return None

    def get_attached_videos_ids(self, obj):
        try:
            return obj.video_array
        except Exception:
            return None

    def get_attached_map_images_ids(self, obj):
        try:
            return obj.map_image_array
        except Exception:
            return None

    def serialize_list(self, obj, cls, data, name=None, overlay_type=None,
                       model_name_plural=None):
        if data is None or len(data) == 0:
            return None
        if name is None:
            name = cls.model_name_plural.title()
        if overlay_type is None:
            overlay_type = cls.model_name
        if model_name_plural is None:
            model_name_plural = cls.model_name_plural
        return {
            'id': model_name_plural,
            'name': name,
            'overlay_type': overlay_type,
            'data': data,
            'attach_url': '%s/api/0/markers/%s/%s/' %
            (settings.SERVER_URL,
             obj.id,
             model_name_plural)}

    class Meta:
        model = models.Record
        fields = GeometrySerializer.Meta.fields + \
            ('form', 'extras', 'url', 'media') + \
            ('attached_photos_ids',
             'attached_audio_ids',
             'attached_videos_ids',
             'attached_map_images_ids')
        depth = 0

    def create(self, validated_data):
        # Override to handle HStore
        if 'attributes' in validated_data:
            for key in validated_data['attributes'].keys():
                val = validated_data['attributes'][key]
                if isinstance(val, (datetime.datetime, datetime.date)):
                    validated_data['attributes'][key] = val.isoformat()
            validated_data['attributes'] = HStoreDict(
                validated_data['attributes'])

        validated_data.update(self.get_presave_create_dictionary())
        validated_data.update({
            'form': self.form,
            'project': self.form.project
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
                # stringify all attribute values before DB commit:
                for key in value:
                    if isinstance(
                            value[key], (datetime.datetime, datetime.date)):
                        value[key] = value[key].isoformat()
                    value[key] = str(value[key])
                instance.attributes.update(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance


class RecordSerializer(RecordSerializerMixin):

    media = serializers.SerializerMethodField()

    class Meta:
        fields = RecordSerializerMixin.Meta.fields + ('media',)

    def get_media(self, obj):
        from django.contrib.contenttypes.models import ContentType
        from localground.apps.site import models

        raise Exception(obj)

        media = {}
        self.audio = self.get_audio(obj) or []
        self.photos = self.get_photos(obj) or []
        self.videos = self.get_videos(obj) or []
        self.map_images = self.get_map_images(obj) or []
        if self.audio:
            media['audio'] = self.audio
        if self.photos:
            media['photos'] = self.photos
        if self.videos:
            media['videos'] = self.videos
        if self.map_images:
            media['map_images'] = self.map_images

        return media


def create_dynamic_serializer(form, **kwargs):
    """
    generate a dynamic serializer from dynamic model
    """
    field_names = []

    for field in form.fields:
        field_names.append(field.col_name)

    class Meta:
        model = models.Record
        fields = RecordSerializerMixin.Meta.fields + \
            tuple(field_names)

    attrs = {
        '__module__':
            'localground.apps.site.api.serializers.MarkerWAttrsSerializer',
        'Meta': Meta,
        'form': form
    }

    # functions to create custom hstore fields
    def createIntField():
        attrs.update({
            field.col_name: serializers.IntegerField(
                source='attributes.' + field.col_name,
                allow_null=True,
                required=False)
        })

    def createChoiceField():
        attrs.update({
            field.col_name: serializers.ChoiceField(
                source='attributes.' + field.col_name,
                choices=list(
                    map(lambda d: (d['name'], d['name']), field.extras)
                ),
                allow_null=True,
                required=False)
        })

    def createRatingField():
        # https://github.com/encode/django-rest-framework/issues/1755
        attrs.update({
            field.col_name: ChoiceIntField(
                source='attributes.' + field.col_name,
                choices=list(
                    map(lambda d: (d['value'], d['name']), field.extras)
                ),
                allow_null=True,
                required=False)
        })

    def createTextField():
        attrs.update({
            field.col_name: serializers.CharField(
                source='attributes.' + field.col_name,
                allow_null=True,
                allow_blank=True,
                required=False)
        })

    def createDateTimeField():
        attrs.update({
            field.col_name: CustomDataTimeField(
                source='attributes.' + field.col_name,
                allow_null=True,
                required=False,
                format="iso-8601",
                input_formats=None)
        })

    def createBooleanField():
        attrs.update({
            field.col_name: serializers.NullBooleanField(
                source='attributes.' + field.col_name,
                required=False)
        })

    def createFloatField():
        attrs.update({
            field.col_name: serializers.FloatField(
                source='attributes.' + field.col_name,
                allow_null=True,
                required=False)
        })
    fieldCases = {
        models.DataType.DataTypes.INTEGER: createIntField,
        models.DataType.DataTypes.TEXT: createTextField,
        models.DataType.DataTypes.DATETIME: createDateTimeField,
        models.DataType.DataTypes.BOOLEAN: createBooleanField,
        models.DataType.DataTypes.DECIMAL: createFloatField,
        models.DataType.DataTypes.RATING: createRatingField,
        models.DataType.DataTypes.CHOICE: createChoiceField
    }

    for field in form.fields:
        if field.data_type.id in fieldCases:
            fieldCases[field.data_type.id]()
        else:
            attrs.update({
                field.col_name: serializers.CharField(
                    source='attributes.' + field.col_name,
                    allow_null=True,
                    required=False)
            })

    return type(
        'DynamicMarkerSerializer', (RecordSerializerMixin, ), attrs
    )
