from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.db.models.fields import Field
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import \
    BaseSerializer, NamedSerializerMixin, ProjectSerializerMixin, \
    MediaGeometrySerializer, AuditSerializerMixin
from localground.apps.site.api.serializers.icon_serializer import \
    IconSerializerList, IconSerializerUpdate
from localground.apps.site.api.serializers.project_serializer import \
    ProjectSerializer, ProjectDetailSerializer
from localground.apps.site.api.serializers.sharing_serializer import \
    SharingListSerializer, SharingDetailSerializer
from localground.apps.site.api.serializers.marker_serializer import \
    MarkerSerializer, MarkerSerializerDetail
from localground.apps.site.api.serializers.marker_w_attrs_serializer \
    import MarkerWAttrsSerializer
from localground.apps.site.api.serializers.association_serializer import \
    AssociationSerializer, AssociationSerializerDetail
from localground.apps.site.api.serializers.photo_serializer import \
    PhotoSerializer, PhotoSerializerUpdate
from localground.apps.site.api.serializers.audio_serializer import \
    AudioSerializer, AudioSerializerUpdate
from localground.apps.site.api.serializers.field_serializer import \
    FieldSerializer, FieldSerializerUpdate
from localground.apps.site.api.serializers.dataset_serializer import \
    DatasetSerializerList, DatasetSerializerDetail
from localground.apps.site.api.serializers.print_serializer import \
    PrintSerializer, PrintSerializerDetail
from localground.apps.site.api.serializers.mapimage_serializer import \
    MapImageSerializerCreate, MapImageSerializerUpdate
from localground.apps.site.api.serializers.mapimage_overlay_serializer import \
    MapImageOverlayCreateSerializer, MapImageOverlayUpdateSerializer
from localground.apps.site.api.serializers.user_profile_serializer import \
    UserProfileSerializer, UserProfileListSerializer
from localground.apps.site.api.serializers.layer_serializer import \
    LayerSerializer, LayerDetailSerializer
from localground.apps.site.api.serializers.map_serializer import \
    MapSerializerList, MapSerializerPost, MapSerializerDetail, \
    MapSerializerDetailSlug
from localground.apps.site.api.serializers.tileset_serializer import \
    TileSetSerializer
from localground.apps.site.api.serializers.video_serializer import \
    VideoSerializer, VideoUpdateSerializer


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username',)


class GroupSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Group
        fields = ('name', )


class LayoutSerializer(serializers.ModelSerializer):
    map_width = serializers.CharField(source='map_width_pixels')
    map_height = serializers.CharField(source='map_height_pixels')

    class Meta:
        model = models.Layout
        fields = ('id', 'name', 'display_name', 'map_width', 'map_height')
        depth = 0


class DataTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Layout
        fields = ('id', 'name')
        depth = 0


class OverlaySourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.OverlaySource
        fields = ('id', 'name')
        depth = 0
