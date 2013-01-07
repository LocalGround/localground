from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template

# http://www.regular-expressions.info/reference.html

#before we started using generic views:
urlpatterns = patterns('localground.apps.vis.viewer.views',
    (r'^editor/$', 'init'),
    (r'^(?P<object_type>projects|views)/(?P<slug>[-\w]+)/$', 'public_map'),
    (r'^(?P<object_type>projects|views)/(?P<slug>[-\w]+)/(?P<access_key>\w{16})/$', 'public_map'),
)