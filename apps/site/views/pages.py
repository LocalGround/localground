#!/usr/bin/env python
from django.http import Http404, HttpResponseRedirect
from django.template import TemplateDoesNotExist, RequestContext
from django.shortcuts import render as direct_to_template, render_to_response
from django.views.generic import TemplateView
from localground.apps.site.models import Project, StyledMap


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
        self.password = request.GET.get('access_key')
        try:
            map = StyledMap.objects.get(slug=kwargs.get('map_slug'))
        except StyledMap.DoesNotExist:
            msg = 'Either map slug={0} does not exist or you don\'t '
            msg += 'have access to it.'
            print msg.format(kwargs.get('map_slug'))
            return HttpResponseRedirect('/')
        return super(PublicView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, map_slug, *args, **kwargs):
        from localground.apps.site.api.serializers import \
            ProjectDetailSerializer, MapSerializerDetail
        from rest_framework.renderers import JSONRenderer

        map = StyledMap.objects.get(slug=map_slug)
        accessLevel = map.metadata.get('accessLevel')
        has_access = accessLevel < StyledMap.Permissions.PASSWORD_PROTECTED \
            or self.password == map.password
        accessLevel = map.metadata.get('accessLevel')
        project = map.project
        renderer = JSONRenderer()

        projectJSON = ProjectDetailSerializer(
            project, context={'request': {}}).data

        mapJSON = MapSerializerDetail(map, context={'request': {}}).data
        context = super(PublicView, self).get_context_data(
            *args, **kwargs)
        if has_access:
            context.update({
                'project': renderer.render(projectJSON),
                'map': renderer.render(mapJSON)
            })
        return context


class MainView(TemplateView):

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated():
            return HttpResponseRedirect('/accounts/login/')
        try:
            project = Project.objects.get(id=kwargs.get('project_id'))
        except Project.DoesNotExist:
            msg = 'Either project id={0} does not exist or you don\'t '
            msg += 'have access to it.'
            print msg.format(kwargs.get('project_id'))
            return HttpResponseRedirect('/')
        return super(MainView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, project_id, *args, **kwargs):
        from localground.apps.site.api.serializers import \
            ProjectDetailSerializer
        from rest_framework.renderers import JSONRenderer

        context = super(MainView, self).get_context_data(
            *args, **kwargs)

        project = Project.objects.get(id=project_id)
        serializer = ProjectDetailSerializer(
            project,
            context={'request': {}}
        )
        renderer = JSONRenderer()
        context.update({'project': renderer.render(serializer.data)})
        return context
