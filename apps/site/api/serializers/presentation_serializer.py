from rest_framework import serializers
from localground.apps.site.api import fields
from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from localground.apps.site import models, widgets


class PresentationSerializer(BaseSerializer):
    code = fields.JSONField(help_text='Where the presentation code is stored',
                            required=True,
                            widget=widgets.JSONWidget)

    class Meta:
        model = models.Presentation
        fields = BaseSerializer.Meta.fields + ('slug', 'code')
        depth = 0