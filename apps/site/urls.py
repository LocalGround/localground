from django.conf.urls import *
from django.conf import settings
from django.shortcuts import render as direct_to_template
import sys
from django.contrib import admin

urlpatterns = patterns('',

    # mostly static html:
    (r'^$', direct_to_template, {'template_name': 'pages/splash.html'}),
    (r'^map/$', direct_to_template, {'template_name': 'pages/map.html'}),
    (r'^gallery/$', direct_to_template, {'template_name': 'pages/gallery.html'}),
    (r'^table/$', direct_to_template, {'template_name': 'pages/spreadsheet.html'}),
    (r'^style/$', direct_to_template, {'template_name': 'pages/style.html'}),
    (r'^presentation/$', direct_to_template, {'template_name': 'pages/presentation.html'}),
    (r'^pages/(?P<page_name>\w+)/', 'localground.apps.site.views.pages.about_pages'),

    # django authentication:
    (r'^accounts/', include('registration.backends.hmac.urls')),
    ('', include('social.apps.django_app.urls', namespace='social')),

    # media server
    (
        r'^profile/(?P<object_type>photos|audio|videos|map-images|prints|tables)/(?P<hash>[=\w]+)/$',
        'localground.apps.site.views.mediaserver.serve_media'),

    # data API
    url(r'^api/0/', include('localground.apps.site.api.urls'))
)

