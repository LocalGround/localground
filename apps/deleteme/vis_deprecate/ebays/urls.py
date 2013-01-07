#!/usr/bin/env python
from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template

# http://www.regular-expressions.info/reference.html

#before we started using generic views:
urlpatterns = patterns('localground.apps.vis.ebays.views',
    (r'^$', 'init'),
)