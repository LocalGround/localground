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
            try:
                model = context.get('view').get_queryset().model or context.get('view').model
            except:
                model = context.get('view').model or context.get('view').get_queryset().model
            query = QueryParser(model, r.get('query'))
            filter_fields = query.populate_filter_fields()
            filters_on = False
            for ff in filter_fields:
                if hasattr(ff, 'value') and ff.value is not None:
                    filters_on = True
                    break
            context.update({
                'filter_fields': filter_fields,
                'sql': query.query_text,
                'object_type': model.model_name,
                'object_name_plural': model.model_name_plural,
                'has_filters': True,
                'filters_on': filters_on
            })
        except Exception:
            context.update({
                'filter_fields': ['No model detected']
            })
        return context
