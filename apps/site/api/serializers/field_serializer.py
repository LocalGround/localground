from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import \
    AuditSerializerMixin, ReorderingMixin
from django.conf import settings
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from localground.apps.site.api import fields


class FieldSerializerSimple(serializers.ModelSerializer):
    data_type = serializers.SlugRelatedField(
        queryset=models.DataType.objects.all(),
        slug_field='name',
        required=False
    )
    extras = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5},
        required=False,
        allow_null=True
    )
    key = serializers.SerializerMethodField()

    def get_key(self, obj):
        return obj.col_name

    class Meta:
        model = models.Field
        read_only_fields = fields = (
            'id',  'key', 'col_alias', 'col_name', 'extras', 'ordering',
            'data_type', 'extras')


class FieldSerializerBase(
        ReorderingMixin, AuditSerializerMixin, FieldSerializerSimple):
    '''
    Hack: can't use HyperlinkSerializer field for URLs with two
    dynamic parameters because of DRF limitations. So, we'll build
    the URL for ourselves:
    '''
    url = serializers.SerializerMethodField()
    col_name = serializers.SerializerMethodField()
    dataset = serializers.SerializerMethodField()

    class Meta:
        model = models.Field
        fields = FieldSerializerSimple.Meta.fields + ('dataset', 'url')

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

    def create(self, validated_data):
        instance = super(FieldSerializer, self).create(validated_data)
        # after insert, reshuffle the other fields:
        instance.ordering = self.reorder_siblings_on_update(
            instance,
            list(instance.dataset.fields),
            instance.ordering
        )
        instance.save()
        return instance


class FieldSerializerUpdate(FieldSerializerBase):
    data_type = serializers.SlugRelatedField(slug_field='name', read_only=True)

    def update(self, instance, validated_data):
        # re-sort the other fields:
        if validated_data.get('ordering') is not None:
            validated_data['ordering'] = self.reorder_siblings_on_update(
                instance,
                list(instance.dataset.fields),
                validated_data.get('ordering')
            )
        return super(
            FieldSerializerUpdate, self).update(instance, validated_data)

    class Meta:
        model = models.Field
        read_only_fields = ('data_type')
        fields = FieldSerializerBase.Meta.fields
