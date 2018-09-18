from localground.apps.site.api.serializers.base_serializer import \
    BaseSerializer, NamedSerializerMixin, ProjectSerializerMixin
from localground.apps.site.api.serializers.field_serializer import \
    FieldSerializer
from django.conf import settings
from rest_framework import serializers
from localground.apps.site import models


class DatasetSerializerList(
        NamedSerializerMixin, ProjectSerializerMixin, BaseSerializer):
    data_url = serializers.SerializerMethodField()
    fields_url = serializers.SerializerMethodField()

    def create(self, validated_data):
        # Call the Dataset's custom create method, which creates
        # 2 fields "for free": Name and Description:
        description = serializers.CharField(
            source='description', required=False, allow_null=True, label='description',
            style={'base_template': 'textarea.html', 'rows': 5}, allow_blank=True
        )
        validated_data.update(self.get_presave_create_dictionary())
        self.instance = models.Dataset.create(**validated_data)
        return self.instance

    class Meta:
        model = models.Dataset
        fields = BaseSerializer.field_list + \
            ('id', 'name', 'description', 'tags', 'url') + \
            ProjectSerializerMixin.field_list + ('data_url', 'fields_url')
        depth = 0

    def get_data_url(self, obj):
        return '%s/api/0/datasets/%s/data/' % (settings.SERVER_URL, obj.pk)

    def get_fields_url(self, obj):
        return '%s/api/0/datasets/%s/fields/' % (settings.SERVER_URL, obj.pk)


class DatasetSerializerDetail(DatasetSerializerList):
    fields = serializers.SerializerMethodField('get_dataset_fields')

    class Meta:
        model = models.Dataset
        fields = DatasetSerializerList.Meta.fields + ('fields',)
        depth = 0

    def get_dataset_fields(self, obj):
        return FieldSerializer(
            obj.fields, many=True,
            context={'request': {}}).data
