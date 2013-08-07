from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.db.models.fields import Field
from localground.apps.site import widgets, models

from localground.apps.site.api.serializers.base_serializer import BaseSerializer, MediaPointSerializer
from localground.apps.site.api.serializers.project_serializer import ProjectSerializer, ProjectDetailSerializer
from localground.apps.site.api.serializers.marker_serializer import MarkerSerializer, MarkerSerializerCounts
from localground.apps.site.api.serializers.association_serializer import AssociationSerializer, AssociationSerializerDetail
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer
from localground.apps.site.api.serializers.print_serializer import PrintSerializer, PrintSerializerDetail
		
class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Group
		fields = ('name', )
	
class WMSOverlaySerializer(serializers.HyperlinkedModelSerializer):
	
	class Meta:
		model = models.WMSOverlay
		fields = ( 'id', 'name', 'tags', 'overlay_type', 'overlay_source')
		depth = 0

class LayoutSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.Layout
		fields = ( 'id', 'name', 'display_name')
		depth = 0

class OverlayTypeSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.OverlayType
		fields = ( 'id', 'name')
		depth = 0
		
class OverlaySourceSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = models.OverlaySource
		fields = ( 'id', 'name')
		depth = 0



	

