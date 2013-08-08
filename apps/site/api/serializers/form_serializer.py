from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from rest_framework import serializers
from localground.apps.site import models

class FormSerializer(BaseSerializer):
	
	class Meta:
		model = models.Form
		fields = BaseSerializer.Meta.fields
		depth = 0