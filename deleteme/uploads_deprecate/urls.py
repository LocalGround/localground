from django.conf.urls.defaults import *
from django.shortcuts import render as direct_to_template

# http://www.regular-expressions.info/reference.html

#before we started using generic views:
urlpatterns = patterns('localground.apps.uploads.views',
    (r'^review/(?P<scan_id>\w+)/json/', 'review_scan.get_scan'),
    (r'^review/(?P<scan_id>\w+)/save-data/', 'review_scan.save_manual_edits'),
    (r'^review/(?P<scan_id>\w+)/', 'review_scan.review_scan'),
    (r'^snip/$', 'review_scan.process_snippets'),
    (r'^by-print-id/(?P<print_id>\w+)/$', 'review_scan.get_scans_by_print'),
    (r'^match/$', 'review_scan.match_scans_to_snippets'),
    (r'^attach/$', 'review_scan.add_attachment_to_scan'),
    (r'^review/$', 'review_scan.review_scan'),
    (r'^delete-review/(?P<review_id>\d+)/$', 'review_scan.delete_review'),
    (r'^get-attachments/$', 'retriever.get_attachments'),
    (r'^get-photos/$', 'retriever.get_photos'),
    (r'^get-videos/$', 'retriever.get_videos'),
    (r'^get-audio/$', 'retriever.get_audio'),
    (r'^get-snippets/(?P<scan_id>\w+)/$', 'retriever.get_snippets'),
    (r'^update-photo/$', 'api.update_photo'),
    (r'^update-photo/embed/$', 'api.update_photo', {
        'embed': True,
        'base_template': 'base/iframe.html'
    }),
    (r'^update-audio/$', 'api.update_audio'),
    (r'^update-audio/embed/$', 'api.update_audio', {
        'embed': True,
        'base_template': 'base/iframe.html'
    }),
    
    (r'^update-record/$', 'digitize_snippets.init', {
        'template_name': 'forms/digitize_snippet_lite.html'
    }),
    (r'^update-record/embed/$', 'digitize_snippets.init', {
        'embed': True,
        'base_template': 'base/iframe.html',
        'template_name': 'forms/digitize_snippet_lite.html'
    }),
    (r'^update-record/map/$', 'digitize_snippets.init', {
        'include_map': True,
        'template_name': 'forms/digitize_snippet.html'    
    }),
    (r'^update-record/map/embed/$', 'digitize_snippets.init', {
        'include_map': True,
        'embed': True,
        'template_name': 'forms/digitize_snippet.html',
        'base_template': 'base/iframe.html'
    }),
    (r'^get-records-by-map-image/(?P<scan_uuid>\w+)/$', 'retriever.get_records_by_scan'),

    #(r'^$', 'review_scan.show_scans')
)
    

