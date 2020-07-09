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
    title_card = serializers.SerializerMethodField()

    def get_title_card(self, obj):
        display_title_card = obj.metadata.get('displayTitleCard')
        if not display_title_card:
            return None
        
        title_card = obj.metadata.get('titleCardInfo')
        media = title_card.get('media')
        # return title_card
        
        if not media:
            title_card['attached_photos_videos'] = []
            title_card['attached_audio'] = []
            return title_card


        photos = self.get_photos(obj)
        videos = self.get_videos(obj)
        audio_files = self.get_audio(obj)
        
        attached_photos_videos = []
        attached_audio = []
        for item in media:
            overlay_type = item.get('overlay_type')
            if overlay_type == 'photo':
                photo = photos.get(item.get('id'))
                photo_dict = PhotoSerializer(photo, context={'request': {}}).data
                attached_photos_videos.append(photo_dict)
            elif overlay_type == 'video':
                video = videos.get(item.get('id'))
                video_dict = VideoSerializer(video, context={'request': {}}).data
                attached_photos_videos.append(video_dict)
            elif overlay_type == 'audio':
                audio = audio_files.get(item.get('id'))
                audio_dict = AudioSerializer(audio, context={'request': {}}).data
                attached_audio.append(audio_dict)

        title_card['attached_photos_videos'] = attached_photos_videos
        title_card['attached_audio'] = attached_audio
        # del title_card['media']
        return title_card
    
    def get_layers(self, obj):
        layers = models.Layer.objects.filter(styled_map=obj)
        data = LayerSerializerPublic(
            layers, many=True, context={
                'request': {},
                'photos': self.get_photos(obj),
                'audio': self.get_audio(obj),
                'videos': self.get_videos(obj),
                'map_images': self.get_map_images(obj),
                'title_card': self.get_title_card(obj)
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

    def get_media_map(self, ModelClass, obj, **kwargs):
        media = {}
        media_list = (
            ModelClass
                .objects.distinct()
                .select_related('owner', 'last_updated_by')
                .filter(project=obj.project)
        )
        for rec in media_list:
            media[rec.id] = rec 
        return media

    def get_photos(self, obj):
        if not hasattr(self, 'photos'):
            self.photos = self.get_media_map(models.Photo, obj)
        return self.photos

    def get_audio(self, obj):
        if not hasattr(self, 'audio'):
            self.audio = self.get_media_map(models.Audio, obj)
        return self.audio
        
    def get_videos(self, obj):
        if not hasattr(self, 'videos'):
            self.videos = self.get_media_map(models.Video, obj)
        return self.videos

    def get_map_images(self, obj):
        if not hasattr(self, 'map_images'):
            self.map_images = self.get_media_map(models.MapImage, obj)
        return self.map_images

    
    class Meta:
        model = models.StyledMap
        fields = MapSerializerList.field_list + (
            'layers', 'name', 'project_id', 'basemap', 'title_card'
        )
        depth = 0
