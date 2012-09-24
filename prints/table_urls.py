#!/usr/bin/env python

from django.conf.urls.defaults import *

#before we started using generic views:
urlpatterns = patterns('localground.prints.views',
    (r'^get-types/$', 'create_form.get_datatypes'),
    (r'^/create-form/$', 'create_form.create_form'),
)