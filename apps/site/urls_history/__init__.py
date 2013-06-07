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
    #view-free urls
    (r'^$', direct_to_template, {'template': 'pages/splash.html'}),
    (r'^about/$', direct_to_template, {'template': 'pages/about.html'}),
    (r'^instructions/$', direct_to_template, {'template': 'pages/instructions.html'}),
    (r'^research/$', direct_to_template, {'template': 'pages/research.html'}),
    (r'^contact/$', direct_to_template, {'template': 'pages/contact.html'}),
    (r'^credits/$', direct_to_template, {'template': 'pages/credits.html'}),
    
    #profile
    (r'^profile/', include('localground.apps.site.urls.profile')),
    
    #api:
    (r'^api/0/tester/', include('localground.apps.site.urls.apitester')),
    (r'^api/0/', include('localground.apps.site.urls.api')),
    
    #overlays
    (r'^overlays/save-marker/$', 'localground.apps.site.views.overlays.save_marker'),
    (r'^overlays/delete-marker/$', 'localground.apps.site.views.overlays.delete_marker'),
    (r'^overlays/show-marker/$', 'localground.apps.site.views.overlays.show_marker_detail'),
    (r'^overlays/show-marker/embed/$', 'localground.apps.site.views.overlays.show_marker_detail',
    {
        'embed': True,
        'base_template': 'base/iframe.html'
    }),

    #print:
    (r'^print/', include('localground.apps.site.urls.prints')),
    
    #scans
    (r'^scans/', include('localground.apps.site.urls.uploads')),
    
    #map viewer:
    (r'^maps/editor/$', 'localground.apps.site.views.maps.init'),
    (r'^maps/(?P<object_type>projects|views)/(?P<slug>[-\w]+)/$', 'localground.apps.site.views.maps.public_map'),
    (r'^maps/(?P<object_type>projects|views)/(?P<slug>[-\w]+)/(?P<access_key>\w{16})/$', 'localground.apps.site.views.maps.public_map'),
    
    #upload:  manages the forms-based uploader:
    (r'^upload/$', 'localground.apps.site.views.uploader.init_upload_form'),
    (r'^upload/embed/$', 'localground.apps.site.views.uploader.init_upload_form', {
        'embed': True,
        'base_template': 'base/iframe.html'
    }),
    (r'^upload/media/post/$', 'localground.apps.site.views.uploader.upload_media'),
    
    #django authentication:
    (r'^accounts/', include('localground.apps.registration.urls')),
    (r'^accounts/login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
    
    #django-tagging:
    url(r'^tagging_autocomplete/list/json$', 'tagging_autocomplete.views.list_tags',
                                            name='tagging_autocomplete-list'),
    
    #EBAYS:
    #(r'^ebays/', include('localground.apps.vis.ebays.urls'))
)
