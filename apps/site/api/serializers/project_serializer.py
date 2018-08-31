from rest_framework import serializers
from django.conf import settings
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import \
    NamedSerializerMixin, BaseSerializer
from localground.apps.site.api.serializers.photo_serializer import \
    PhotoSerializer
from localground.apps.site.api.serializers.field_serializer import \
    FieldSerializerSimple
from localground.apps.site.api.serializers.video_serializer import \
    VideoSerializer
from localground.apps.site.api.serializers.mapimage_serializer import \
    MapImageSerializerUpdate
from localground.apps.site.api.serializers.audio_serializer import \
    AudioSerializer
from localground.apps.site.api.metadata import CustomMetadata
from localground.apps.site.api.serializers.map_serializer import \
    MapSerializerList
from localground.apps.site.api.serializers.record_serializer import \
    create_dynamic_serializer
from django.contrib.gis.geos import GEOSGeometry
import uuid


class ProjectSerializerMixin(object):
    sharing_url = serializers.SerializerMethodField()

    def get_sharing_url(self, obj):
        view = self.context.get('view')
        return '%s/api/0/projects/%s/users/' % (
            settings.SERVER_URL,
            obj.id)


class ProjectSerializer(
        NamedSerializerMixin, ProjectSerializerMixin, BaseSerializer):
    sharing_url = serializers.SerializerMethodField()
    access_authority = serializers.PrimaryKeyRelatedField(
        queryset=models.ObjectAuthority.objects.all(),
        read_only=False, required=False)
    # slug = serializers.SlugField(max_length=100, label='friendly url')
    last_updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.Project
        read_only_fields = ('time_stamp', 'date_created', 'last_updated_by')
        fields = BaseSerializer.field_list + NamedSerializerMixin.field_list \
            + (
                # 'slug',
                'access_authority', 'sharing_url', 'time_stamp',
                'date_created', 'last_updated_by'
            )
        depth = 0

    def create(self, validated_data):
        # Overriding create so that creating a new projects also creates
        # a new map with a new dataset and a new layer
        self.instance = super(ProjectSerializer, self).create(validated_data)
        # Note: if no dataset specified, the create method automatically
        # creates a new Layer and a new Dataset:
        # TODO: default lat/lng?
        models.StyledMap.create(
            center=GEOSGeometry(
                '{"type": "Point", "coordinates": [-122, 38]}'),
            zoom=6,
            last_updated_by=self.instance.owner,
            owner=self.instance.owner,
            project=self.instance,
            slug=uuid.uuid4().hex,
            name='Untitled Map'
        )
        return self.instance

    def get_last_updated_by(self, obj):
        return obj.last_updated_by.username


class ProjectDetailSerializer(ProjectSerializer):
    # slug = serializers.SlugField(
    #     max_length=100, label='friendly url', required=False)
    datasets = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()
    maps = serializers.SerializerMethodField()
    view = None

    class Meta:
        model = models.Project
        read_only_fields = ('time_stamp', 'date_created', 'last_updated_by')
        fields = ProjectSerializer.Meta.fields + \
            ('sharing_url', 'datasets', 'media', 'maps')
        depth = 0

    def get_metadata(self, serializer_class):
        m = CustomMetadata()
        return m.get_serializer_info(serializer_class)

    def get_maps(self, obj):
        return self.serialize_list(
            models.StyledMap,
            MapSerializerList,
            models.StyledMap.objects.filter(project=obj).order_by('name')
        )

    def get_datasets(self, obj):
        datasets = models.Dataset.objects.prefetch_related(
                'field_set', 'field_set__data_type'
            ).filter(project=obj)

        dataset_dictionary = {}

        # add table data:
        for dataset in datasets:
            dataset_dictionary['dataset_%s' % dataset.id] = self.get_table_records(dataset)
        return dataset_dictionary

    def get_media(self, obj):
        media = {
            'photos': self.get_photos(obj),
            'videos': self.get_videos(obj),
            'audio': self.get_audio(obj),
            'map_images': self.get_mapimages(obj)
        }
        return media

    def get_table_records(self, dataset):
        records = dataset.get_records()
        return self.serialize_list(
            models.Record,
            create_dynamic_serializer(dataset),
            records,
            name=dataset.name,
            overlay_type='record',
            model_name_plural='dataset_%s' % dataset.id,
            fields=dataset.fields
        )

    def get_photos(self, obj):
        return self.serialize_list(
            models.Photo,
            PhotoSerializer,
            models.Photo.objects.get_objects(
                obj.owner,
                project=obj
            )
        )

    def get_videos(self, obj):
        return self.serialize_list(
            models.Video,
            VideoSerializer,
            models.Video.objects.get_objects(
                obj.owner,
                project=obj
            )
        )

    def get_audio(self, obj):
        return self.serialize_list(
            models.Audio,
            AudioSerializer,
            models.Audio.objects.get_objects(
                obj.owner,
                project=obj
            )
        )

    def get_mapimages(self, obj):
        return self.serialize_list(
            models.MapImage,
            MapImageSerializerUpdate,
            models.MapImage.objects.get_objects(
                obj.owner,
                project=obj,
                processed_only=False
            ),
            name="Map Images"
        )

    def serialize_list(
            self, model_class, serializer_class, records, name=None,
            overlay_type=None, model_name_plural=None, fields=None):
        if name is None:
            name = model_class.model_name_plural.title()
        if overlay_type is None:
            overlay_type = model_class.model_name
        if model_name_plural is None:
            model_name_plural = model_class.model_name_plural

        serializer = serializer_class(
            records, many=True, context={'request': {}})

        d = {
            'dataType': model_name_plural,
            'name': name,
            'overlay_type': overlay_type,
            'data': serializer.data
        }
        if fields:
            d.update({
                'fields': FieldSerializerSimple(
                    fields, many=True, context={'request': {}}).data
            })
        return d
