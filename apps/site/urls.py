from django.conf.urls import include
from django.urls import path, re_path

from django.conf import settings
from django.shortcuts import render as direct_to_template
from localground.apps.site.views import document_view
from localground.apps.site.views.pages import PublicView, MainView
from django.conf.urls.static import static

from localground.apps.site.views import pages

urlpatterns = [

    # mostly static html:
    re_path(r'^$', direct_to_template, {'template_name': 'pages/splash.html'}),
    re_path(r'^style-guide/$', pages.style_guide_pages),
    re_path(r'^style-guide/(?P<page_name>\w+)/$', pages.style_guide_pages),
    re_path(r'^projects/(?P<project_id>[0-9]+)/$', MainView.as_view(template_name='pages/project_detail.html')),
    re_path(r'^projects/(?P<project_id>[0-9]+)/maps/$', MainView.as_view(template_name='pages/main.html')),
    re_path(r'^maps/(?P<map_slug>[\w-]+)/$', PublicView.as_view(template_name='pages/presentation1.html')),
    # # (r'^data/(?P<project_id>[0-9]+)/$', MainView.as_view(template_name='pages/data.html')),
    re_path(r'^pages/(?P<page_name>\w+)/', pages.about_pages),
    re_path(r'^documentation/$', direct_to_template, {'template_name': 'pages/documentation.html'}),
    re_path(r'^about/$', direct_to_template, {'template_name': 'pages/about.html'}),

    # # django authentication:
    path('accounts/', include('django_registration.backends.activation.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    # path('', include('social.apps.django_app.urls', namespace='social')),

    # # media server
    # path(
    #     r'^profile/(?P<object_type>photos|audio|videos|map-images|prints|tables)/(?P<hash>[=\w]+)/$',
    #     'localground.apps.site.views.mediaserver.serve_media'),

    # # data API
    # url(r'^api/0/', include('localground.apps.site.api.urls')),

    # # document
    path('amazon-tester/', document_view.DocumentCreateView.as_view(), name='home')
]

if settings.DEBUG:
    # Store static CSS, JS, etc. locally:
    urlpatterns += static('/static/', document_root=settings.STATIC_ROOT)
    # TODO: when S3 fully migrated, remove this path:
    urlpatterns += static('/userdata/', document_root=settings.USER_MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns