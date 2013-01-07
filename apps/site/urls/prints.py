from django.conf.urls.defaults import *

urlpatterns = patterns('localground.apps.site.views',
    # configuring and generating printed maps:
    (r'^$', 'create_print.generate_print'),
    (r'^generate/$', 'create_print.generate_print'),
    (r'^generate/embed/$', 'create_print.generate_print', {
        'embed': True,
        'base_template': 'base/iframe.html'
    }),
    
    # configuring and generating forms:
    (r'^forms/get-types/$', 'create_form.get_datatypes'),
    (r'^forms/create-form/$', 'create_form.create_form'),
    
    # api: getting a print:
    (r'^get/$', 'apiprints.get_print'),
    (r'^get/(?P<print_id>\w+)/$', 'apiprints.get_print'),
    
    #api: convenience auto-complete function:
    (r'^auto-complete/$', 'apiprints.get_prints_autocomplete'),
)