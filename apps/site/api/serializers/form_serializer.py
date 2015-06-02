from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from localground.apps.site.api.serializers.field_serializer import FieldSerializer
from django.conf import settings
from rest_framework import serializers, validators
from localground.apps.site import models

class FormSerializerList(BaseNamedSerializer):
    
    def get_fields(self, *args, **kwargs):
        fields = super(FormSerializerList, self).get_fields(*args, **kwargs)
        #restrict project list at runtime:
        fields['project_ids'].child_relation.queryset = self.get_projects()
        return fields
    
    project_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=models.Project.objects.all(), #note: queryset restricted at runtime (above)
        source='projects'
    )
    data_url = serializers.SerializerMethodField()
    fields_url = serializers.SerializerMethodField()
    slug = serializers.SlugField(
        max_length=100,
        label='friendly url'
    )

    class Meta:
        model = models.Form
        fields = BaseNamedSerializer.Meta.fields + ('data_url', 'fields_url', 'slug', 'project_ids') 
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

