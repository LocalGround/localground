from rest_framework import serializers
from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from localground.apps.site import models


class FieldSerializer(BaseSerializer):
    #data_type = serializers.SlugRelatedField(slug_field='name')
    #form = serializers.SlugRelatedField(slug_field='id')

    class Meta:
        model = models.Field
        read_only_fields = ('data_type', 'form')
        fields = ('id', 'form', 'col_alias', 'data_type', 'is_display_field',
                  'is_printable', 'has_snippet_field', 'ordering')
