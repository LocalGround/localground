from django.template import RequestContext, loader
from rest_framework import renderers, exceptions, parsers, status, VERSION
from rest_framework.settings import api_settings
from localground.apps.lib.helpers import QueryParser
import sys

class BrowsableAPIRenderer(renderers.BrowsableAPIRenderer):

    def get_context(self, data, accepted_media_type, renderer_context):
        
        context = super(BrowsableAPIRenderer, self).get_context(
                data, accepted_media_type, renderer_context
            )
        request = renderer_context.get('request')
        r = request.GET
        try:
            model = context.get('view').model or context.get('view').get_queryset().model
            query = QueryParser(model, r.get('query'))
            context.update({
                'filter_fields': query.populate_filter_fields(),
                'object_type': model.model_name,
                'object_name_plural': model.model_name_plural,
                'has_filters': True
            })  
        
        except Exception:
            context.update({
                'filter_fields': ['No model detected']
            })
        return context
