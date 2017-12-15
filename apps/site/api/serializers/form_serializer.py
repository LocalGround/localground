from localground.apps.site.api.serializers.base_serializer import \
    BaseNamedSerializer
from localground.apps.site.api.serializers.field_serializer import \
    FieldSerializer
from django.conf import settings
from rest_framework import serializers, validators
from localground.apps.site import models


class FormSerializerList(BaseNamedSerializer):
    data_url = serializers.SerializerMethodField()
    fields_url = serializers.SerializerMethodField()
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Project.objects.all(),
        source='project',
        required=True
    )

    def get_fields(self, *args, **kwargs):
        fields = super(BaseNamedSerializer, self).get_fields(*args, **kwargs)
        # restrict project list at runtime:
        fields['project_id'].queryset = self.get_projects()
        return fields

    class Meta:
        model = models.Form
        fields = BaseNamedSerializer.Meta.fields + \
            ('data_url', 'fields_url', 'project_id')
        depth = 0

    def get_data_url(self, obj):
        return '%s/api/0/forms/%s/data/' % (settings.SERVER_URL, obj.pk)

    def get_fields_url(self, obj):
        return '%s/api/0/forms/%s/fields/' % (settings.SERVER_URL, obj.pk)


class FormSerializerDetail(FormSerializerList):
    fields = serializers.SerializerMethodField('get_form_fields')

    class Meta:
        model = models.Form
        fields = FormSerializerList.Meta.fields + ('fields',)
        depth = 0

    def get_form_fields(self, obj):
        return FieldSerializer(
            obj.fields, many=True,
            context={'request': {}}).data
