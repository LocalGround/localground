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


def style_guide_pages(request, page_name):
    try:
        return direct_to_template(
            request,
            template_name="style-guide/%s.html" %
            page_name)
    except TemplateDoesNotExist:
        raise Http404()


class MainView(TemplateView):

    def get_context_data(self, project_id, *args, **kwargs):
        from localground.apps.site.api.serializers import \
            ProjectDetailSerializer
        from localground.apps.site.models import Project
        from rest_framework.renderers import JSONRenderer

        context = super(MainView, self).get_context_data(
            *args, **kwargs)

        serializer = ProjectDetailSerializer(
            Project.objects.get(id=project_id),
            context={'request': {}}
        )
        renderer = JSONRenderer()
        context.update({'project': renderer.render(serializer.data)})
        return context
