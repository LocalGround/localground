from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
#base url:  /api/0/*
urlpatterns = patterns('',
    # single group json:
    (r'^(?P<object_type>projects|views)/$', 'localground.apps.account.views.api.get_group'),
    (r'^(?P<object_type>projects|views)/(?P<access_key>\w{16})/$', 'localground.apps.account.views.api.get_group'),
    (r'^(?P<object_type>projects|views)/(?P<object_id>\d+)/$', 'localground.apps.account.views.api.get_group'),
    (r'^(?P<object_type>projects|views)/(?P<object_id>\d+)/(?P<access_key>\w{16})/$', 'localground.apps.account.views.api.get_group'),
    (r'^(?P<object_type>projects|views)/(?P<slug>[-\w]+)/$', 'localground.apps.account.views.api.get_group'),
    (r'^(?P<object_type>projects|views)/(?P<slug>[-\w]+)/(?P<access_key>\w{16})/$', 'localground.apps.account.views.api.get_group'),
    
    (r'^my-projects/$', 'localground.apps.account.views.api.get_my_projects'),
    
    (r'^print/$', 'localground.apps.prints.views.api.get_print'),
    
    (r'^print/(?P<print_id>\w+)/$', 'localground.apps.prints.views.api.get_print'),
    
    (r'^my-prints/$', 'localground.apps.prints.views.api.get_user_prints'),
    
    
    (r'^tables/table/(?P<form_id>\w+)/$', 'localground.apps.prints.views.api.get_table_data'),
    (r'^tables/table/(?P<form_id>\w+)/get-menu/$', 'localground.apps.prints.views.api.get_menu'),
    
    #(r'^my-groups/$', 'localground.apps.account.views.groups.get_user_groups'),
    #(r'^group/(?P<group_slug>w+)/$',
    #                            'localground.apps.account.views.groups.get_group'),
    #(r'^group/$', 'localground.apps.account.views.groups.get_group'),
    
    (r'^my-photos/$', 'localground.apps.uploads.views.api.get_photos'),
    
    (r'^my-audio/$', 'localground.apps.uploads.views.api.get_audio'),
    
    (r'^get-users-from-string/$',
                'localground.apps.account.views.api.get_users_from_username_string'),
    
    (r'^map-images/get-image-options/$',
                        'localground.apps.uploads.views.api.get_scan_photo_options'),
    
    (r'^map-images/save-image-option/$',
                                'localground.apps.uploads.views.api.set_scan_photo'),
    
    (r'^update-latlng/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.uploads.views.api.update_latlng'),
    
    (r'^remove-latlng/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.uploads.views.api.update_latlng',
                                { 'remove': True }),
    
    (r'^add/(?P<object_type>\w+)/$',
                                'localground.apps.uploads.views.api.create_object'),
    
    #get object:
    (r'^get/(?P<object_type>\w+)/(?P<object_id>\d+)/$', 'localground.apps.uploads.views.api.get_object'),
    (r'^get/(?P<object_type>\w+)/(?P<object_id>\d+)/(?P<access_key>\w{16})/$', 'localground.apps.uploads.views.api.get_object'),
    
    (r'^update/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.uploads.views.api.update_object'),
    (r'^delete/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.uploads.views.api.delete_object'),
    
    (r'^marker/append/(?P<marker_id>\d+)/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.uploads.views.api.append_to_marker'),
    (r'^marker/remove/(?P<object_type>\w+)/(?P<object_id>\d+)/$',
                                'localground.apps.uploads.views.api.remove_from_marker')
    
    
    
)