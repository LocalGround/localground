from django.conf.urls.defaults import *
from django.shortcuts import render as direct_to_template
#base url:  /api/0/*
urlpatterns = patterns('',
    # single group json:
    (r'^(?P<object_type>projects|views)/$', 'localground.apps.site.views.api.get_group'),
    (r'^(?P<object_type>projects|views)/(?P<access_key>\w{16})/$', 'localground.apps.site.views.api.get_group'),
    (r'^(?P<object_type>projects|views)/(?P<object_id>\d+)/$', 'localground.apps.site.views.api.get_group'),
    (r'^(?P<object_type>projects|views)/(?P<object_id>\d+)/(?P<access_key>\w{16})/$', 'localground.apps.site.views.api.get_group'),
    (r'^(?P<object_type>projects|views)/(?P<slug>[-\w]+)/$', 'localground.apps.site.views.api.get_group'),
    (r'^(?P<object_type>projects|views)/(?P<slug>[-\w]+)/(?P<access_key>\w{16})/$', 'localground.apps.site.views.api.get_group'),
    
    (r'^my-projects/$', 'localground.apps.site.views.api.get_my_projects'),
    
    (r'^print/$', 'localground.apps.site.views.apiprints.get_print'),
    
    (r'^print/(?P<print_id>\w+)/$', 'localground.apps.site.views.apiprints.get_print'),
    
    (r'^my-prints/$', 'localground.apps.site.views.apiprints.get_user_prints'),
    
    
    (r'^tables/table/(?P<form_id>\w+)/$', 'localground.apps.site.views.apiprints.get_table_data'),
    (r'^tables/table/(?P<form_id>\w+)/get-menu/$', 'localground.apps.site.views.apiprints.get_menu'),

    
    (r'^my-photos/$', 'localground.apps.site.views.apiviews.get_photos'),
    
    (r'^my-audio/$', 'localground.apps.site.views.apiviews.get_audio'),
    
    (r'^get-users-from-string/$',
                'localground.apps.site.views.api.get_users_from_username_string'),
    
    (r'^map-images/get-image-options/$',
                        'localground.apps.site.views.apiviews.get_scan_photo_options'),
    
    (r'^map-images/save-image-option/$',
                                'localground.apps.site.views.apiuploads.set_scan_photo'),
    
    (r'^update-latlng/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.site.views.apiuploads.update_latlng'),
    
    (r'^remove-latlng/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.site.views.apiuploads.update_latlng',
                                { 'remove': True }),
    
    (r'^add/(?P<object_type>\w+)/$',
                                'localground.apps.site.views.apiuploads.create_object'),
    
    #get object:
    (r'^get/(?P<object_type>\w+)/(?P<object_id>\d+)/$', 'localground.apps.site.views.apiuploads.get_object'),
    (r'^get/(?P<object_type>\w+)/(?P<object_id>\d+)/(?P<access_key>\w{16})/$', 'localground.apps.site.views.apiuploads.get_object'),
    
    (r'^update/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.site.views.apiuploads.update_object'),
    (r'^delete/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.site.views.apiuploads.delete_object'),
    
    (r'^marker/append/(?P<marker_id>\d+)/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.site.views.apiuploads.append_to_marker'),
    (r'^marker/remove/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.site.views.apiuploads.remove_from_marker')
    
    
    
)