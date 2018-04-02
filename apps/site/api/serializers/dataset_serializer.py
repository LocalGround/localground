from localground.apps.site.api.serializers.base_serializer import \
    BaseSerializer, NamedSerializerMixin, ProjectSerializerMixin
from localground.apps.site.api.serializers.field_serializer import \
    FieldSerializer
from django.conf import settings
from rest_framework import serializers
from localground.apps.site import models


class DatasetSerializerList(
        BaseSerializer, NamedSerializerMixin, ProjectSerializerMixin):
    data_url = serializers.SerializerMethodField()
    fields_url = serializers.SerializerMethodField()

    def create(self, validated_data):
        # Call the Form's custom create method, which creates
        # 2 fields "for free": Name and Description:
        validated_data.update(self.get_presave_create_dictionary())
        self.instance = models.Form.create(**validated_data)
        return self.instance

    class Meta:
        model = models.Form
        fields = BaseSerializer.field_list + \
            NamedSerializerMixin.field_list + \
            ProjectSerializerMixin.field_list + ('data_url', 'fields_url')
        depth = 0

    def get_data_url(self, obj):
        return '%s/api/0/datasets/%s/data/' % (settings.SERVER_URL, obj.pk)

    def get_fields_url(self, obj):
        return '%s/api/0/datasets/%s/fields/' % (settings.SERVER_URL, obj.pk)


class DatasetSerializerDetail(DatasetSerializerList):
    fields = serializers.SerializerMethodField('get_form_fields')

    class Meta:
        model = models.Form
        fields = DatasetSerializerList.Meta.fields + ('fields',)
        depth = 0

    def get_form_fields(self, obj):
        return FieldSerializer(
            obj.fields, many=True,
            context={'request': {}}).data
