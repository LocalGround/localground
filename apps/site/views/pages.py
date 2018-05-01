#!/usr/bin/env python
from django.http import Http404, HttpResponseRedirect
from django.template import TemplateDoesNotExist, RequestContext
from django.shortcuts import render as direct_to_template, render_to_response
from django.views.generic import TemplateView
from localground.apps.site.models import Project


def about_pages(request, page_name):
    try:
        return direct_to_template(
            request,
            template_name="pages/%s.html" %
            page_name)
    except TemplateDoesNotExist:
        raise Http404()


def style_guide_pages(request, page_name='banners'):
    try:
        return render_to_response(
            "style-guide/%s.html" % page_name,
            {'page_name': page_name},
            context_instance=RequestContext(request))
    except TemplateDoesNotExist:
        raise Http404()


class PublicView(TemplateView):

    def dispatch(self, request, *args, **kwargs):
        try:
            project = Project.objects.get(id=kwargs.get('project_id'))
        except Project.DoesNotExist:
            msg = 'Either project id={0} does not exist or you don\'t '
            msg += 'have access to it.'
            print msg.format(kwargs.get('project_id'))
            return HttpResponseRedirect('/')
        return super(PublicView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, project_id, *args, **kwargs):
        from localground.apps.site.api.serializers import \
            ProjectDetailSerializer
        from rest_framework.renderers import JSONRenderer

        context = super(PublicView, self).get_context_data(
            *args, **kwargs)

        project = Project.objects.get(id=project_id)
        serializer = ProjectDetailSerializer(
            project,
            context={'request': {}}
        )
        renderer = JSONRenderer()
        context.update({'project': renderer.render(serializer.data)})
        return context


class MainView(PublicView):
    # if not logged in, redirect to login screen:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return HttpResponseRedirect('/accounts/login/')
        return super(MainView, self).dispatch(request, *args, **kwargs)
