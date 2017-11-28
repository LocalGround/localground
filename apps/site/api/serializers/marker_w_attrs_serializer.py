from localground.apps.site.api.serializers.base_serializer import GeometrySerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings
from django_hstore.dict import HStoreDict


class MarkerWAttrsSerializerMixin(GeometrySerializer):
    update_metadata = serializers.SerializerMethodField()

    class Meta:
        model = models.MarkerWithAttributes
        fields = GeometrySerializer.Meta.fields + \
            ('form', 'extras')
        depth = 0

    def create(self, validated_data):
        # Override to handle HStore
        validated_data['attributes'] = HStoreDict(validated_data['attributes'])
        validated_data.update(self.get_presave_create_dictionary())
        self.instance = self.Meta.model.objects.create(**validated_data)
        return self.instance

    def update(self, instance, validated_data):
        # Override to handle HStore
        validated_data['attributes'] = HStoreDict(validated_data['attributes'])
        validated_data.update(self.get_presave_update_dictionary())
        return super(MarkerWAttrsSerializerMixin, self).update(
            instance, validated_data
        )


class MarkerWAttrsSerializer(MarkerWAttrsSerializerMixin):
    pass


def create_dynamic_serializer(form, **kwargs):
    """
    generate a dynamic serializer from dynamic model
    """
    field_names = []
    display_field = None

    for field in form.fields:
        if field.is_display_field:
            display_field = field
            field_names.append('display_name')
        field_names.append(field.col_name)

    class Meta:
        model = models.MarkerWithAttributes
        fields = MarkerWAttrsSerializerMixin.Meta.fields + tuple(field_names)
        read_only_fields = ('display_name')

    attrs = {
        '__module__': 'localground.apps.site.api.serializers.MarkerWAttrsSerializer',
        'Meta': Meta
    }
    for field in form.fields:
        if field.data_type.id == models.DataType.DataTypes.INTEGER:
            attrs.update({
                field.col_name: serializers.IntegerField(
                    source='attributes.' + field.col_name,
                    allow_null=True,
                    required=False)
            })
        elif field.data_type.id == models.DataType.DataTypes.CHOICE:
            attrs.update({
                field.col_name: serializers.ChoiceField(
                    source='attributes.' + field.col_name,
                    allow_null=True,
                    required=False,
                    choices=('mural', 'sculpture'))
            })
        else:
            attrs.update({
                field.col_name: serializers.CharField(
                    source='attributes.' + field.col_name,
                    allow_null=True,
                    required=False)
            })


    # set custom display name field getter, according on the display_field:
    if display_field is not None:
        attrs.update({
            'display_name': serializers.CharField(
                source=display_field.col_name, read_only=True)
        })

    return type('DynamicMarkerSerializer', (MarkerWAttrsSerializerMixin, ), attrs)
