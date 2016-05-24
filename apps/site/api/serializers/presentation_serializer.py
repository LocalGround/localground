from rest_framework import serializers
from localground.apps.site.api import fields
from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from localground.apps.site import models, widgets


class PresentationSerializer(BaseNamedSerializer):
    '''
    code = fields.JSONField(help_text='Where the presentation code is stored',
                            required=True,
                            widget=widgets.JSONWidget)
    '''
    code = fields.JSONField(
        #widget=widgets.JSONWidget,
        style={'base_template': 'json.html', 'rows': 5},
        required=False)

    class Meta:
        model = models.Presentation
        fields = BaseNamedSerializer.Meta.fields + ('slug', 'code')
        depth = 0
