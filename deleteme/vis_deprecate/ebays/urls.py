#!/usr/bin/env python
from django.conf.urls.defaults import *
from django.shortcuts import render as direct_to_template

# http://www.regular-expressions.info/reference.html

#before we started using generic views:
urlpatterns = patterns('localground.apps.vis.ebays.views',
    (r'^$', 'init'),
)