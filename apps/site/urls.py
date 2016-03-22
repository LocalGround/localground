from django.conf.urls import *
from django.conf import settings
from django.shortcuts import render as direct_to_template
import sys
from django.contrib import admin

#from django.shortcuts import render as direct_to_template

# Uncomment the next two lines to enable the admin:
#from django.contrib import admin
# admin.autodiscover()

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

object_types_plural = ['photos', 'audio', 'videos', 'map-images', 'projects',
                       'snapshots', 'prints', 'forms', 'tiles']
#handler500 = 'localground.apps.account.views.server_error'
urlpatterns = patterns('',

                       # mostly static html:
                       (r'^$',
                        direct_to_template,
                        {'template_name': 'pages/splash.html'}),
                       (r'^pages/(?P<page_name>\w+)/',
                        'localground.apps.site.views.pages.about_pages'),

                       # user prefs:
                       # This should really be in the API, but is here for now
                       (r'^profile/settings/',
                        'localground.apps.site.views.profile.change_user_profile'),

                       #-------------------------------------------------------
                       # 1) Create:
                       #-------------------------------------------------------
                       (r'^profile/(?P<object_type_plural>projects|snapshots)/(?P<action>create)/embed/$',
                        'localground.apps.site.views.sharing.create_update_group_with_sharing',
                        {'embed': True}),
                       (r'^profile/(?P<object_type_plural>projects|snapshots)/(?P<action>create)/$',
                           'localground.apps.site.views.sharing.create_update_group_with_sharing'),
                       #-------------------------------------------------------
                       # 2) Read:
                       #-------------------------------------------------------
                       (r'^profile/(?P<object_type_plural>{0})/$'.format('|'.join(
                           object_types_plural)), 'localground.apps.site.views.profile.object_list_form'),
                       (
                           r'^profile/(?P<object_type_plural>{0})/embed/$'.format(
                               '|'.join(object_types_plural)), 'localground.apps.site.views.profile.object_list_form', {
                               'embed': True}),

                       #-------------------------------------------------------
                       # 3) Update:
                       #-------------------------------------------------------
                       (r'^profile/(?P<object_type_plural>projects|snapshots|forms)/(?P<object_id>\d+)/(?P<action>update|share)/embed/$',
                        'localground.apps.site.views.sharing.create_update_group_with_sharing',
                        {'embed': True}),
                       (
                           r'^profile/(?P<object_type_plural>projects|snapshots|forms)/(?P<object_id>\d+)/(?P<action>update|share)/$',
                           'localground.apps.site.views.sharing.create_update_group_with_sharing'),
                       (r'^profile/forms/create/embed/$',
                        'localground.apps.site.views.forms.create_update_form',
                        {'embed': True}),
                       (r'^profile/forms/create/$',
                        'localground.apps.site.views.forms.create_update_form'),
                       (r'^profile/forms/(?P<object_id>\d+)/embed/$',
                        'localground.apps.site.views.forms.create_update_form',
                        {'embed': True}),
                       (r'^profile/forms/(?P<object_id>\d+)/$',
                        'localground.apps.site.views.forms.create_update_form'),
                       
                       (r'^profile/tables/$',
                        'localground.apps.site.views.form_data.show_tables'),

                       #-------------------------------------------------------
                       # 4) Delete
                       #-------------------------------------------------------
                       (r'^profile/(?P<object_type_plural>{0})/delete/batch/$'.format('|'.join(
                           object_types_plural)), 'localground.apps.site.views.profile.delete_batch'),

                       # contacts
                       (r'^profile/get-contacts/$',
                        'localground.apps.site.views.generic.get_contacts_autocomplete'),
                       (r'^profile/get-contacts/(?P<format>\w+)/$',
                        'localground.apps.site.views.generic.get_contacts_autocomplete'),
                       (r'^profile/get-my-contacts/$',
                        'localground.apps.site.views.generic.get_my_contacts_autocomplete'),
#                        (r'^accounts/login/$',
#                        'localground.apps.site.views.login.login_check',
#                        {'template_name': 'login.html'}),
                       # django authentication:
                       (r'^accounts/',
                        include('registration.backends.hmac.urls')),
                       ('', include('social.apps.django_app.urls', namespace='social')),


                       # django-tagging:
                       #url(r'^tagging_autocomplete/list/json$', 'tagging_autocomplete.views.list_tags', name='tagging_autocomplete-list'),

                       # uploader:
                       (r'^upload/$',
                        'localground.apps.site.views.uploader.init_upload_form'),
                       (r'^upload/embed/$',
                        'localground.apps.site.views.uploader.init_upload_form',
                        {'embed': True}),
                       (r'^upload/(?P<media_type>map-images)/$',
                           'localground.apps.site.views.uploader.init_upload_form'),
                       (r'^upload/(?P<media_type>map-images)/embed/$',
                        'localground.apps.site.views.uploader.init_upload_form',
                        {'embed': True}),

                       # media server
                       (
                           r'^profile/(?P<object_type>photos|audio|videos|map-images|prints|tables)/(?P<hash>[=\w]+)/$',
                           'localground.apps.site.views.mediaserver.serve_media'),

                       # data API
                       url(r'^api/0/',
                           include('localground.apps.site.api.urls')),

                       # interactive maps
                       (r'^maps/edit/air-quality/',
                        'localground.apps.site.views.ebays.show_ebays_map_editor'),
                       (r'^maps/edit/$',
                        'localground.apps.site.views.maps.show_map_editor'),
                       (r'^maps/edit/new/$',
                        'localground.apps.site.views.maps.show_map_editor_new',
                        {'template': 'map/editor1.html'}),
                       (r'^maps/embed/(?P<slug>[\w-]+)',
                        'localground.apps.site.views.maps.show_map_viewer_embedded',
                        {'template': 'map/embedded.html'}),
                       (r'^maps/view/public/air-quality/$',
                        'localground.apps.site.views.ebays.show_ebays_map_viewer'),
                       (
                           r'^maps/view/(?P<username>[\w|-|.|_]+)/(?P<slug>[\w-]+)/$',
                           'localground.apps.site.views.maps.show_map_viewer'),
                       (
                           r'^maps/view/(?P<username>[\w|-|.|_]+)/(?P<slug>[\w-]+)/(?P<access_key>\w+)/$',
                           'localground.apps.site.views.maps.show_map_viewer'),
                       (r'^sdtest/$',
                        'localground.apps.site.views.test.sdtest'))
