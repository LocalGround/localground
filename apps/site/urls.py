from django.conf.urls import *
from django.conf import settings
from django.shortcuts import render as direct_to_template
from django.contrib.auth.decorators import login_required
import sys
from django.contrib import admin
from localground.apps.site.views import document_view
from localground.apps.site.views.pages import PublicView, MainView
from django.conf.urls.static import static

urlpatterns = patterns('',

    # mostly static html:
    (r'^$', direct_to_template, {'template_name': 'pages/splash.html'}),
    (r'^style-guide/$', 'localground.apps.site.views.pages.style_guide_pages'),
    (r'^style-guide/(?P<page_name>\w+)/$', 'localground.apps.site.views.pages.style_guide_pages'),
    (r'^projects/(?P<project_id>[0-9]+)/$', MainView.as_view(template_name='pages/project_detail.html')),
    (r'^projects/(?P<project_id>[0-9]+)/maps/$', MainView.as_view(template_name='pages/main.html')),
    (r'^maps/(?P<map_slug>[\w-]+)/$', PublicView.as_view(template_name='pages/presentation1.html')),
    # (r'^data/(?P<project_id>[0-9]+)/$', MainView.as_view(template_name='pages/data.html')),
    (r'^pages/(?P<page_name>\w+)/', 'localground.apps.site.views.pages.about_pages'),
    (r'^documentation/$', direct_to_template, {'template_name': 'pages/documentation.html'}),
    (r'^about/$', direct_to_template, {'template_name': 'pages/about.html'}),

    # django authentication:
    (r'^accounts/', include('registration.backends.hmac.urls')),
    ('', include('social.apps.django_app.urls', namespace='social')),

    # media server
    (
        r'^profile/(?P<object_type>photos|audio|videos|map-images|prints|tables)/(?P<hash>[=\w]+)/$',
        'localground.apps.site.views.mediaserver.serve_media'),

    # data API
    url(r'^api/0/', include('localground.apps.site.api.urls')),

    # document
    url(r'^amazon-tester/$', document_view.DocumentCreateView.as_view(),
        name='home')
)

if settings.DEBUG:
    # Store static CSS, JS, etc. locally:
    urlpatterns += static('/static/', document_root=settings.STATIC_ROOT)
    # TODO: when S3 fully migrated, remove this path:
    urlpatterns += static('/userdata/', document_root=settings.USER_MEDIA_ROOT)
