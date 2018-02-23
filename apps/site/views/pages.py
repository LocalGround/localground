#!/usr/bin/env python
from django.http import Http404
from django.template import TemplateDoesNotExist
from django.shortcuts import render as direct_to_template
from django.views.generic import TemplateView


def about_pages(request, page_name):
    try:
        return direct_to_template(
            request,
            template_name="pages/%s.html" %
            page_name)
    except TemplateDoesNotExist:
        raise Http404()


class MainView(TemplateView):

    def get_context_data(self, *args, **kwargs):
        from localground.apps.site.api.serializers import \
            ProjectDetailSerializer
        import json
        from localground.apps.site.models import Project
        from rest_framework.renderers import JSONRenderer
        #try: 
        projectID = int(self.request.GET.get('project_id'))
        #except Exception:
        #    raise Exception('?project_id={{id}} required')


        context = super(MainView, self).get_context_data(
            *args, **kwargs)

        serializer = ProjectDetailSerializer(
            Project.objects.get(id=projectID),
            context={'request': {}}
        )
        renderer = JSONRenderer()
        context.update({'project': renderer.render(serializer.data)})
        return context
