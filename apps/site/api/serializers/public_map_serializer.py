from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from localground.apps.site.api.serializers.record_serializer import create_dynamic_serializer
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer
from localground.apps.site.api.serializers.field_serializer import FieldSerializerSimple
from localground.apps.site.api.serializers.video_serializer import VideoSerializer
from localground.apps.site.api.serializers.mapimage_serializer import MapImageSerializerUpdate
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer
from localground.apps.site.api.serializers.map_serializer import MapSerializerList
import random

class LayerSerializerPublic(BaseSerializer):
    dataset = serializers.SerializerMethodField(read_only=True)
    symbols = serializers.SerializerMethodField(read_only=True)

    def get_dataset(self, obj):
        return 'dataset_{0}'.format(obj.dataset.id)

    def get_symbols(self, obj):
        serializer = create_dynamic_serializer(obj.dataset)
        records = serializer(
            obj.dataset.get_records(), many=True, context={'request': {}}
        ).data
        symbols = []
        for i, kwargs in enumerate(obj.symbols):
            symbol = models.Symbol(**kwargs)
            
            symbol_dict = symbol.generate_svg()
            # get matches here
            # 1. Parse into "truth statement"
            # 2. Check which models match
            # 3. Add ids to symbol
            recs = []
            for rec in records:
                if symbol.check_if_match(rec):
                    recs.append(rec)
            symbol_dict['records'] = recs
            symbol_dict['id'] = i + 1
            print(symbol_dict['id'])
            symbols.append(symbol_dict)
        return symbols
    
    class Meta:
        model = models.Layer
        fields = BaseSerializer.field_list + ('title', 'dataset', 'symbols')
        depth = 0

class MapSerializerPublic(MapSerializerList):
    layers = serializers.SerializerMethodField()
    basemap = serializers.SerializerMethodField()
    project_id = serializers.SerializerMethodField()
    datasets = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()
    
    def get_layers(self, obj):
        layers = models.Layer.objects.filter(styled_map=obj)
        return LayerSerializerPublic(
            layers, many=True, context={'request': {}}
        ).data

    def get_basemap(self, obj):
        return obj.basemap.name.lower().replace(' ', '-')

    def get_project_id(self, obj):
        return obj.project.id

    def get_datasets(self, obj):
        datasets = models.Dataset.objects.prefetch_related(
                'field_set', 'field_set__data_type'
            ).filter(project=obj.project)

        dataset_dictionary = {}

        # add table data:
        for dataset in datasets:
            dataset_dictionary['dataset_%s' % dataset.id] = self.get_table_records(dataset)
        return dataset_dictionary

    def get_table_records(self, dataset):
        records = dataset.get_records()
        return {
            'data': self.serialize_list(
                create_dynamic_serializer(dataset),
                records
            ),
            'fields': self.serialize_list(
                FieldSerializerSimple,
                dataset.fields
            )
        }

    def serialize_list(self, serializer_class, records):
        serializer = serializer_class(
            records, many=True, context={'request': {}})
        lookup = {}
        for item in serializer.data:
            lookup[item.get('id')] = item
        return lookup

    def get_media(self, obj):
        media = {
            'photos': self.get_photos(obj.project),
            'videos': self.get_videos(obj.project),
            'audio': self.get_audio(obj.project),
            'map_images': self.get_mapimages(obj.project)
        }
        return media

    def get_photos(self, obj):
        return self.serialize_list(
            PhotoSerializer,
            models.Photo.objects.get_objects(
                obj.owner,
                project=obj
            )
        )

    def get_videos(self, obj):
        return self.serialize_list(
            VideoSerializer,
            models.Video.objects.get_objects(
                obj.owner,
                project=obj
            )
        )

    def get_audio(self, obj):
        return self.serialize_list(
            AudioSerializer,
            models.Audio.objects.get_objects(
                obj.owner,
                project=obj
            )
        )

    def get_mapimages(self, obj):
        return self.serialize_list(
            MapImageSerializerUpdate,
            models.MapImage.objects.get_objects(
                obj.owner,
                project=obj,
                processed_only=False
            )
        )
    
    class Meta:
        model = models.StyledMap
        fields = MapSerializerList.field_list + (
            'layers', 'name', 'project_id', 'datasets', 'media',
            'basemap'
        )
        depth = 0
