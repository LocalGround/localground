from django.template import RequestContext, loader
from rest_framework import renderers, exceptions, parsers, status, VERSION
from rest_framework.settings import api_settings
from localground.apps.lib.helpers import QueryParser

class BrowsableAPIRenderer(renderers.BrowsableAPIRenderer): 
    
    def get_render_context(self, data, accepted_media_type=None, renderer_context=None):
        """
        Directly copied from rest_framework renderers.BrowsableAPIRenderer.render,
        but just returning the context, rather than the whole thing
        """
        accepted_media_type = accepted_media_type or ''
        renderer_context = renderer_context or {}

        view = renderer_context['view']
        request = renderer_context['request']
        response = renderer_context['response']
        media_types = [parser.media_type for parser in view.parser_classes]

        renderer = self.get_default_renderer(view)
        content = self.get_content(renderer, data, accepted_media_type, renderer_context)

        put_form = self._get_form(view, 'PUT', request)
        post_form = self._get_form(view, 'POST', request)
        patch_form = self._get_form(view, 'PATCH', request)
        delete_form = self._get_form(view, 'DELETE', request)
        options_form = self._get_form(view, 'OPTIONS', request)

        raw_data_put_form = self._get_raw_data_form(view, 'PUT', request, media_types)
        raw_data_post_form = self._get_raw_data_form(view, 'POST', request, media_types)
        raw_data_patch_form = self._get_raw_data_form(view, 'PATCH', request, media_types)
        raw_data_put_or_patch_form = raw_data_put_form or raw_data_patch_form

        name = self.get_name(view)
        description = self.get_description(view)
        breadcrumb_list = self.get_breadcrumbs(request)

        template = loader.get_template(self.template)
        context = RequestContext(request, {
            'content': content,
            'view': view,
            'request': request,
            'response': response,
            'description': description,
            'name': name,
            'version': VERSION,
            'breadcrumblist': breadcrumb_list,
            'allowed_methods': view.allowed_methods,
            'available_formats': [renderer.format for renderer in view.renderer_classes],

            'put_form': put_form,
            'post_form': post_form,
            'patch_form': patch_form,
            'delete_form': delete_form,
            'options_form': options_form,

            'raw_data_put_form': raw_data_put_form,
            'raw_data_post_form': raw_data_post_form,
            'raw_data_patch_form': raw_data_patch_form,
            'raw_data_put_or_patch_form': raw_data_put_or_patch_form,

            'api_settings': api_settings
        })
        return context
    
    def render(self, data, accepted_media_type=None, renderer_context=None):
        request = renderer_context['request']
        r = request.GET
        response = renderer_context['response']
        view = renderer_context['view']
        context = self.get_render_context(data, accepted_media_type, renderer_context)
            
        try:
            model = view.queryset.model or view.model
            query = QueryParser(model, r.get('query'))
            context.update({
                'filter_fields': query.populate_filter_fields(),
                'object_type': model.name,
                'object_name_plural': model.model_name_plural,
                'has_filters': True
            })  
        except Exception:
            context.update({
                'filter_fields': ['No model detected']
            })
        
        
        """
        Also directly copied from rest_framework's renderers.BrowsableAPIRenderer.render
        """
        template = loader.get_template(self.template)
        ret = template.render(context)
        if response.status_code == status.HTTP_204_NO_CONTENT:
            response.status_code = status.HTTP_200_OK

        return ret