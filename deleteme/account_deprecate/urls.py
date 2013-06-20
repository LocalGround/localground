from django.conf.urls.defaults import *
from django.shortcuts import render as direct_to_template

#before we started using generic views:
urlpatterns = patterns('localground.apps.account.views',
    ###########
    # profile #
    ###########
    (r'^settings/$', 'generic.change_user_profile')
)
    
####################
# projects & views #
####################
urlpatterns += patterns('localground.apps.account.views',
    url(r'^(?P<object_type>projects|views)/$', 'groups.show_group_list'),
    url(r'^(?P<object_type>projects|views)/(?P<edit_type>create)/$', 'groups.create_update_project', name='create-group'),
    url(r'^(?P<object_type>projects|views)/(?P<edit_type>create)/embed/$', 'groups.create_update_project', {'embed': True}, name='create-group-embed'),
    url(r'^(?P<object_type>projects|views)/(?P<edit_type>create|update|update-sharing)/(?P<object_id>\d+)/$', 'groups.create_update_project', name='update-group'),
    url(r'^(?P<object_type>projects|views)/(?P<edit_type>create|update|update-sharing)/embed/(?P<object_id>\d+)/$', 'groups.create_update_project', {'embed': True}, name='update-group-embed'),
    url(r'^(?P<object_type>projects|views)/delete/$', 'groups.delete_groups')
)

################
# media server #
################
urlpatterns += patterns('localground.apps.account.views',
    url(r'^(?P<object_type>photos|audio-files|videos|snippets|attachments|map-images|prints|tables)/(?P<hash>[=\w]+)/$', 'mediaserver.serve_media'),
)

###########
# general #
###########
urlpatterns += patterns('localground.apps.account.views',
    (r'^send-invitation/$', 'generic.send_invitation'),
    (r'^get-contacts/$', 'generic.get_contacts_autocomplete'),
    (r'^get-contacts/(?P<format>\w+)/$', 'generic.get_contacts_autocomplete'),
    (r'^get-my-contacts/$', 'generic.get_my_contacts_autocomplete'),
    
)

urlpatterns += patterns('localground.apps.prints.views',
    #############################
    # user-defined tabular data #
    #############################
    (r'^tables/$', 'tables.get_objects'),
    (r'^tables/delete-selected/$', 'tables.delete_objects'),
    (r'^tables/move-blanks/$', 'tables.update_blank_status'),
    (r'^tables/move-project/$', 'tables.move_to_project'),
    (r'^tables/download/(?P<format>[a-z-]+)/', 'tables.download'),
    (r'^tables/vis/(?P<format_type>[a-z-]+)/', 'tables.get_objects'),
)
    
urlpatterns += patterns('localground.apps.uploads.views',
    #######################################
    # scans, audio, video, photos, prints #
    #######################################
    (r'^(?P<object_type>[a-z-]+)/$', 'media.get_objects'),
    (r'^(?P<object_type>[a-z-]+)/delete/(?P<object_id>\d+)/$', 'media.delete_object'),
    (r'^(?P<object_type>[a-z-]+)/delete-selected/$', 'media.delete_objects'),
    (r'^(?P<object_type>[a-z-]+)/move-project/$', 'media.move_to_project'),
    #(r'^(?P<object_type>[a-z-]+)/reprocess/$', 'media.reprocess'),
)
    

