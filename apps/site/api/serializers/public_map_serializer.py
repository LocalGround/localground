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

'''
    The public map viewer requires a nested data structure as follows:
    - Map
        - Layer 1
            - Symbol A
                - Matched Records ->
                    - Rec 1
                        - id, name, description
                        - a bunch of key-value pairs
                        - photos_videos array: []
                        - fields: []
                        - audio: []
                        - map_images: []
            - Symbol B
                - ...

        - Layer 2
            - Symbol C
            - Symbol D
'''


class LayerSerializerPublic(BaseSerializer):
    dataset = serializers.SerializerMethodField(read_only=True)
    symbols = serializers.SerializerMethodField(read_only=True)
    isShowing = serializers.SerializerMethodField(read_only=True)
    display_field = serializers.SerializerMethodField(read_only=True)

    def get_dataset(self, obj):
        return 'dataset_{0}'.format(obj.dataset.id)
    
    def get_isShowing(self, obj):
        isShowing = 0
        for s in obj.symbols:
            symbol = models.Symbol(**s)
            isShowing += symbol.isShowing
        return isShowing

    def get_display_field(self, obj):
        return obj.display_field.col_name

    def get_symbols(self, obj):
        serializer = create_dynamic_serializer(obj.dataset)
        records = serializer(
            obj.dataset.get_records(), many=True, context={
                'request': {},
                'photos': self.context.get('photos'),
                'audio': self.context.get('audio'),
                'videos': self.context.get('videos'),
                'map_images': self.context.get('map_images'),
                'display_field': obj.display_field
            }
        ).data
        symbols = {}
        for i, kwargs in enumerate(obj.symbols):
            symbol = models.Symbol(**kwargs)
            symbol_id = i + 1
            symbol_dict = symbol.generate_svg()
            # get matches here
            # 1. Parse into "truth statement"
            # 2. Check which models match
            # 3. Add ids to symbol
            recs = {}
            for rec in records:
                if symbol.check_if_match(rec):
                    recs[rec.get('id')] = rec
            symbol_dict['records'] = recs
            symbol_dict['id'] = symbol_id
            symbols[symbol_id] = symbol_dict
        return symbols
    
    class Meta:
        model = models.Layer
        fields = BaseSerializer.field_list + ('title', 'dataset', 'symbols', 'isShowing', 'display_field')
        depth = 0

class MapSerializerPublic(MapSerializerList):
    layers = serializers.SerializerMethodField()
    basemap = serializers.SerializerMethodField()
    project_id = serializers.SerializerMethodField()
    
    def get_layers(self, obj):
        layers = models.Layer.objects.filter(styled_map=obj)
        data = LayerSerializerPublic(
            layers, many=True, context={
                'request': {},
                'photos': self.getMediaMap(models.Photo, obj),
                'audio': self.getMediaMap(models.Audio, obj),
                'videos': self.getMediaMap(models.Video, obj),
                'map_images': self.getMediaMap(models.MapImage, obj, processed_only=False)
            }
        ).data
        layers_dict = {}
        for layer in data:
            layers_dict[layer.get('id')] = layer
        return layers_dict

    def get_basemap(self, obj):
        return obj.basemap.name.lower().replace(' ', '-')

    def get_project_id(self, obj):
        return obj.project.id

    def getMediaMap(self, ModelClass, obj, **kwargs):
        media = {}
        media_list = ModelClass.objects.filter(project=obj.project)
        for rec in media_list:
            media[rec.id] = rec 
        return media

    
    class Meta:
        model = models.StyledMap
        fields = MapSerializerList.field_list + (
            'layers', 'name', 'project_id', 'basemap'
        )
        depth = 0
