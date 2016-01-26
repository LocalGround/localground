from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import AuditSerializerMixin
from django.conf import settings
from localground.apps.lib.helpers import get_timestamp_no_milliseconds

class FieldSerializerBase(AuditSerializerMixin, serializers.ModelSerializer):
    '''
    Hack: can't use HyperlinkSerializer field for URLs with two
    dynamic parameters because of DRF limitations. So, we'll build
    the URL for ourselves:
    '''
    url = serializers.SerializerMethodField()#'get_url')
    col_name = serializers.SerializerMethodField()
    form = serializers.SerializerMethodField()
    data_type = serializers.SlugRelatedField(
                                queryset=models.DataType.objects.all(),
                                slug_field='name',
                                required=False
                            )

    class Meta:
        model = models.Field
        fields = ('id', 'form', 'col_alias', 'col_name', 'is_display_field',
                    'ordering', 'data_type', 'url')
        
    def get_url(self, obj):
        return '%s/api/0/forms/%s/fields/%s' % \
                (settings.SERVER_URL, obj.form.id, obj.id)
        
    def get_col_name(self, obj):
        return obj.col_name
    
    def get_form(self, obj):
        return obj.form.id

class FieldSerializer(FieldSerializerBase):
    class Meta:
        model = models.Field
        fields = FieldSerializerBase.Meta.fields
    
class FieldSerializerUpdate(FieldSerializerBase):
    data_type = serializers.SlugRelatedField(slug_field='name', read_only=True)
    class Meta:
        model = models.Field
        read_only_fields = ( 'data_type')
        fields =  FieldSerializerBase.Meta.fields
