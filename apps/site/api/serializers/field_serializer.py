from rest_framework import serializers
from localground.apps.site import models

class FieldSerializer(serializers.ModelSerializer):
	data_type = serializers.SlugRelatedField(slug_field='name')
	
	class Meta:
		model = models.Field
		fields = ('form', 'col_alias', 'data_type', 'is_display_field',
					 'is_printable', 'has_snippet_field', 'ordering')
