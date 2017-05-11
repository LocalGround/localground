from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.db.models.fields import Field
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import BaseSerializer, BaseNamedSerializer, MediaGeometrySerializer, AuditSerializerMixin
from localground.apps.site.api.serializers.project_serializer import ProjectSerializer, ProjectDetailSerializer
from localground.apps.site.api.serializers.sharing_serializer import SharingListSerializer, SharingDetailSerializer
from localground.apps.site.api.serializers.marker_serializer import MarkerSerializer, MarkerSerializerCounts, MarkerSerializerCountsWithMetadata, MarkerSerializerLists, MarkerSerializerListsWithMetadata
from localground.apps.site.api.serializers.association_serializer import AssociationSerializer, AssociationSerializerDetail
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer, PhotoSerializerUpdate
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer, AudioSerializerUpdate
from localground.apps.site.api.serializers.field_serializer import FieldSerializer, FieldSerializerUpdate
from localground.apps.site.api.serializers.form_serializer import FormSerializerList, FormSerializerDetail
from localground.apps.site.api.serializers.record_serializer import create_record_serializer, create_compact_record_serializer
from localground.apps.site.api.serializers.presentation_serializer import PresentationSerializer
from localground.apps.site.api.serializers.print_serializer import PrintSerializer, PrintSerializerDetail
from localground.apps.site.api.serializers.mapimage_serializer import MapImageSerializerCreate, MapImageSerializerUpdate
from localground.apps.site.api.serializers.user_profile_serializer import UserProfileSerializer, UserProfileListSerializer
from localground.apps.site.api.serializers.layer_serializer import LayerSerializer, LayerDetailSerializer
from localground.apps.site.api.serializers.map_serializer import MapSerializer, MapDetailSerializer, MapDetailSerializerSlug
from localground.apps.site.api.serializers.tileset_serializer import TileSetSerializer


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username',)


class GroupSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Group
        fields = ('name', )

class LayoutSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Layout
        fields = ('id', 'name', 'display_name', 'map_width_pixels', 'map_height_pixels')
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
