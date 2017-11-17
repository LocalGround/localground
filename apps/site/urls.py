from django.conf.urls import *
from django.conf import settings
from django.shortcuts import render as direct_to_template
from django.contrib.auth.decorators import login_required
import sys
from django.contrib import admin
from mysite.core import views

urlpatterns = patterns('',

    # mostly static html:
    (r'^$', direct_to_template, {'template_name': 'pages/splash.html'}),
    (r'^map/$', login_required(direct_to_template), {'template_name': 'pages/map.html'}),
    (r'^data/$', login_required(direct_to_template), {'template_name': 'pages/data.html'}),
    (r'^gallery/$', login_required(direct_to_template), {'template_name': 'pages/gallery.html'}),
    (r'^table/$', login_required(direct_to_template), {'template_name': 'pages/spreadsheet.html'}),
    (r'^style/$', login_required(direct_to_template), {'template_name': 'pages/style.html'}),
    (r'^presentation/$', direct_to_template, {'template_name': 'pages/presentation.html'}),
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
    url(r'^amazon-tester/, views.DocumentCreateView.as_view(), name='home'),
)
