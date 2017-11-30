from localground.apps.site.api.serializers.base_serializer import GeometrySerializer
from rest_framework import serializers
from django.conf import settings
from rest_framework.reverse import reverse
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings
from django_hstore.dict import HStoreDict
from rest_framework.settings import api_settings


class MarkerWAttrsSerializerMixin(GeometrySerializer):
    update_metadata = serializers.SerializerMethodField()
    #url = serializers.HyperlinkedIdentityField(view_name='markerwithattributes-detail', format='html')
    '''
    Hack: can't use HyperlinkSerializer field for URLs with two
    dynamic parameters because of DRF limitations. So, we'll build
    the URL for ourselves:
    '''
    url = serializers.SerializerMethodField()#'get_url')
    form = serializers.SerializerMethodField()

    def get_url(self, obj):
        return '%s/api/0/forms/%s/data/%s' % \
                (settings.SERVER_URL, obj.form.id, obj.id)

    def get_form(self, obj):
        return self.form.id


    class Meta:
        model = models.MarkerWithAttributes
        fields = GeometrySerializer.Meta.fields + \
            ('form', 'extras', 'url')
        depth = 0

    def create(self, validated_data):
        # Override to handle HStore
        validated_data['attributes'] = HStoreDict(validated_data['attributes'])
        validated_data.update(self.get_presave_create_dictionary())
        validated_data.update({'form': self.form})
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
        'Meta': Meta,
        'form': form
    }

    def createIntField():
        attrs.update({
            field.col_name: serializers.IntegerField(
                source='attributes.' + field.col_name,
                allow_null=True,
                required=False)
        })
    def createTextField():
        attrs.update({
            field.col_name: serializers.CharField(
                source='attributes.' + field.col_name,
                allow_null=True,
                required=False)
        })
    def createDateTimeField():
        attrs.update({
            field.col_name: serializers.DateTimeField(
                source='attributes.' + field.col_name,
                allow_null=True,
                required=False,
                format="iso-8601",
                input_formats=None)
        })
    def createBooleanField():
        attrs.update({
            field.col_name: serializers.BooleanField(
                source='attributes.' + field.col_name,
                required=False)
        })
    def createDecimalField():
        attrs.update({
            field.col_name: serializers.DecimalField(
                source='attributes.' + field.col_name,
                allow_null=True,
                required=False,
                max_digits=50,
                decimal_places=10)
        })
    fieldCases = {
        models.DataType.DataTypes.INTEGER: createIntField,
        models.DataType.DataTypes.TEXT: createTextField,
        models.DataType.DataTypes.DATETIME: createDateTimeField,
        models.DataType.DataTypes.BOOLEAN: createBooleanField,
        models.DataType.DataTypes.DECIMAL: createDecimalField,
        models.DataType.DataTypes.RATING: createIntField
    }

    for field in form.fields:
        if field.data_type.id in fieldCases:
            fieldCases[field.data_type.id]()
        else:
            attrs.update({
                field.col_name: serializers.CharField(
                    source='attributes.' + field.col_name,
                    allow_null=True,
                    required=False)
            })


        # if field.data_type.id == models.DataType.DataTypes.INTEGER:
        #     attrs.update({
        #         field.col_name: serializers.IntegerField(
        #             source='attributes.' + field.col_name,
        #             allow_null=True,
        #             required=False)
        #     })
        # elif field.data_type.id == models.DataType.DataTypes.TEXT:
        #     attrs.update({
        #         field.col_name: serializers.CharField(
        #             source='attributes.' + field.col_name,
        #             allow_null=True,
        #             required=False)
        #     })
        # elif field.data_type.id == models.DataType.DataTypes.DATETIME:
        #     attrs.update({
        #         field.col_name: serializers.DateTimeField(
        #             source='attributes.' + field.col_name,
        #             allow_null=True,
        #             required=False,
        #             format="iso-8601",
        #             input_formats=None)
        #     })
        # elif field.data_type.id == models.DataType.DataTypes.BOOLEAN:
        #     attrs.update({
        #         field.col_name: serializers.BooleanField(
        #             source='attributes.' + field.col_name,
        #             required=False)
        #     })
        # elif field.data_type.id == models.DataType.DataTypes.DECIMAL:
        #     attrs.update({
        #         field.col_name: serializers.DecimalField(
        #             source='attributes.' + field.col_name,
        #             allow_null=True,
        #             required=False,
        #             max_digits=50,
        #             decimal_places=10)
        #     })
        # elif field.data_type.id == models.DataType.DataTypes.RATING:
        #     attrs.update({
        #         field.col_name: serializers.IntegerField(
        #             source='attributes.' + field.col_name,
        #             allow_null=True,
        #             required=False)
        #     })


        # error implementing choicefield. For potential help, see:
        # https://stackoverflow.com/questions/29248164/key-error-in-django-rest-framework-when-using-serializers-choicefield-with-tuple
        # elif field.data_type.id == models.DataType.DataTypes.CHOICE:
        #     choices = []
        #     for choice in field.extras:
        #         choices.append((unicode(choice['name']), unicode(choice['name'])))
        #     tuple(choices)
        #     #raise Exception(choices)
        #     attrs.update({
        #         field.col_name: serializers.ChoiceField(
        #             source='attributes.' + field.col_name,
        #             allow_null=True,
        #             required=False,
        #             choices=choices)
        #     })

        # else:
        #     attrs.update({
        #         field.col_name: serializers.CharField(
        #             source='attributes.' + field.col_name,
        #             allow_null=True,
        #             required=False)
        #     })

    # set custom display name field getter, according on the display_field:
    if display_field is not None:
        def get_display_name(self, obj):
            return obj.attributes.get(display_field.col_name)

        attrs.update({
            'display_name': serializers.SerializerMethodField(),
            'get_display_name': get_display_name
        })

    return type('DynamicMarkerSerializer', (MarkerWAttrsSerializerMixin, ), attrs)
