from django.conf.urls.defaults import *
from django.conf import settings
from django.views.generic.simple import direct_to_template

# Uncomment the next two lines to enable the admin:
#from django.contrib import admin
#admin.autodiscover()

'''
--------------------------------------------------------------------------------
On using different URL patterns to point to the same view:
https://docs.djangoproject.com/en/1.2/topics/http/urls/#naming-url-patterns
--------------------------------------------------------------------------------
EXCERPT:
It's fairly common to use the same view function in multiple URL patterns in your
URLconf.  This is completely valid, but it leads to problems when you try to do
reverse URL matching (through the permalink() decorator or the url template tag).
Continuing this example, if you wanted to retrieve the URL for the archive view,
Django's reverse URL matcher would get confused, because two URL patterns point
at that view.

To solve this problem, Django supports named URL patterns. That is, you can give
a name to a URL pattern in order to distinguish it from other patterns using the
same view and parameters. Then, you can use this name in reverse URL matching.
--------------------------------------------------------------------------------
'''
    
handler500 = 'localground.apps.account.views.server_error' 
urlpatterns = patterns('',
                       
    #mostly static html:
    (r'^$', direct_to_template, {'template': 'pages/splash.html'}),
    (r'^pages/(?P<page_name>\w+)/', 'localground.apps.site.views.pages.about_pages'),
    
    #user prefs:
    (r'^profile/settings/', 'localground.apps.site.views.profile.change_user_profile'),
    
    #listings:
    (r'^profile/listing/(?P<object_type>photo|audio|video|scan|project|view|print|attachment|wmsoverlay)', 'localground.apps.site.views.profile.object_list_form'),
    #(r'^profile/listing/(?P<object_type>form)', 'localground.apps.site.views.profile.table_list_form'),
    (r'^profile/listing/delete/(?P<object_type>photo|audio|video|scan|project|view|print|attachment|form|wmsoverlay)/$', 'localground.apps.site.views.profile.delete_batch'),
    
    #individual objects:
    (r'^profile/(?P<action>create)/(?P<object_type>project|view)/embed/', 'localground.apps.site.views.profile.create_update_group_with_sharing', { 'embed': True }),
    (r'^profile/(?P<action>create)/(?P<object_type>project|view)/', 'localground.apps.site.views.profile.create_update_group_with_sharing'),
    (r'^profile/(?P<action>update|share)/(?P<object_type>project|view)/embed/(?P<object_id>\d+)/', 'localground.apps.site.views.profile.create_update_group_with_sharing', { 'embed': True }),
    (r'^profile/(?P<action>update|share)/(?P<object_type>project|view)/(?P<object_id>\d+)/', 'localground.apps.site.views.profile.create_update_group_with_sharing'),
  
    #tables
    (r'^profile/listing/table/', 'localground.apps.site.views.tables.get_objects'),
    #(r'^tables/delete-selected/$', 'tables.delete_objects'),
    #(r'^tables/move-blanks/$', 'tables.update_blank_status'),
    #(r'^tables/move-project/$', 'tables.move_to_project'),
    #(r'^tables/download/(?P<format>[a-z-]+)/', 'tables.download'),
    #(r'^tables/vis/(?P<format_type>[a-z-]+)/', 'tables.get_objects'),
    
    #contacts
    (r'^profile/get-contacts/$', 'localground.apps.site.views.generic.get_contacts_autocomplete'),
    (r'^profile/get-contacts/(?P<format>\w+)/$', 'localground.apps.site.views.generic.get_contacts_autocomplete'),
    (r'^profile/get-my-contacts/$', 'localground.apps.site.views.generic.get_my_contacts_autocomplete'),
    
    #django authentication:
    (r'^accounts/', include('localground.apps.registration.urls')),
    (r'^accounts/login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
    
    #django-tagging:
    url(r'^tagging_autocomplete/list/json$', 'tagging_autocomplete.views.list_tags',
                                            name='tagging_autocomplete-list'),
    
    #uploader:
    (r'^upload/$', 'localground.apps.site.views.uploader.init_upload_form'),
    (r'^upload/media/post/$', 'localground.apps.site.views.uploader.upload_media'),
    
    # media server
    (r'^profile/(?P<object_type>photos|audio|videos|snippets|attachments|map-images|prints|tables)/(?P<hash>[=\w]+)/$', 'localground.apps.site.views.mediaserver.serve_media'),
  
    
    
)