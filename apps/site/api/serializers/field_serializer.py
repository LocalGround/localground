from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import \
    AuditSerializerMixin
from django.conf import settings
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from localground.apps.site.api import fields


class FieldSerializerSimple(serializers.ModelSerializer):

    data_type = serializers.SlugRelatedField(
        queryset=models.DataType.objects.all(),
        slug_field='name',
        required=False
    )

    class Meta:
        model = models.Field
        read_only_fields = fields = (
            'id',  'col_alias', 'col_name', 'extras', 'ordering',
            'data_type')


class FieldSerializerBase(AuditSerializerMixin, FieldSerializerSimple):
    '''
    Hack: can't use HyperlinkSerializer field for URLs with two
    dynamic parameters because of DRF limitations. So, we'll build
    the URL for ourselves:
    '''
    url = serializers.SerializerMethodField()
    col_name = serializers.SerializerMethodField()
    dataset = serializers.SerializerMethodField()
    help_text = 'Use to store ratings and lookup tables. Example: ['
    help_text += '{"key1": "value1", "key2": "value2" }, '
    help_text += '{"key1": "value3", "key2": "value4" }]'
    extras = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5},
        required=False,
        allow_null=True,
        help_text=help_text
    )

    class Meta:
        model = models.Field
        fields = (
            'id', 'dataset', 'col_alias', 'col_name', 'extras', 'ordering',
            'data_type', 'url')

    def get_url(self, obj):
        return '%s/api/0/datasets/%s/fields/%s' % \
                (settings.SERVER_URL, obj.dataset.id, obj.id)

    def get_col_name(self, obj):
        return obj.col_name

    def get_dataset(self, obj):
        return obj.dataset.id


class FieldSerializer(FieldSerializerBase):
    class Meta:
        model = models.Field
        fields = FieldSerializerBase.Meta.fields


class FieldSerializerUpdate(FieldSerializerBase):
    data_type = serializers.SlugRelatedField(slug_field='name', read_only=True)

    class Meta:
        model = models.Field
        read_only_fields = ('data_type')
        fields = FieldSerializerBase.Meta.fields
