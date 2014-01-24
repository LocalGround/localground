from django.conf.urls import patterns, url
from django.conf.urls import include
from localground.apps.site.api import views
from localground.apps.site import models
from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns

entities = ['audio', 'photos', 'map-images']

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'audio', views.AudioViewSet)
#router.register(r'photos', views.PhotoViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'map-images', views.ScanViewSet)
router.register(r'data-types', views.DataTypeViewSet)
router.register(r'tiles', views.TileViewSet)
router.register(r'layouts', views.LayoutViewSet)
router.register(r'overlay-types', views.OverlayTypeViewSet)
router.register(r'overlay-sources', views.OverlaySourceViewSet)

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browseable API.
urlpatterns = patterns('',
	url(r'^$', views.api_root),
	url(r'^', include(router.urls[1:])), # a hack to include both ViewSets and views on the front page
)

urlpatterns += format_suffix_patterns(patterns('',
	url(r'^(?P<group_name_plural>markers|views|prints)/(?P<source_id>[0-9]+)/(?P<entity_name_plural>\w+)/$', views.RelatedMediaList.as_view(), name='related-media-list'),
	url(r'^(?P<group_name_plural>markers|views|prints)/(?P<source_id>[0-9]+)/(?P<entity_name_plural>\w+)/(?P<id>[0-9]+)/$', views.RelatedMediaInstance.as_view(), name='related-media-detail'),
	url(r'^projects/(?P<pk>[0-9]+)/$', views.ProjectInstance.as_view(), name='project-detail'),
	url(r'^projects/$', views.ProjectList.as_view(), name='project-list'),
	url(r'^photos/(?P<pk>[0-9]+)/$', views.PhotoInstance.as_view(), name='photo-detail'),
	url(r'^photos/$', views.PhotoList.as_view(), name='photo-list'),
	url(r'^markers/(?P<pk>[0-9]+)/$', views.MarkerInstance.as_view(), name='marker-detail'),
	url(r'^markers/$', views.MarkerList.as_view(), name='marker-list'),
	url(r'^prints/(?P<pk>[0-9]+)/$', views.PrintInstance.as_view(), name='print-detail'),
	url(r'^prints/$', views.PrintList.as_view(), name='print-list'),
	url(r'^forms/(?P<form_id>[0-9]+)/data/(?P<pk>[0-9]+)/$', views.FormDataInstance.as_view(), name='form-data-instance'),
	url(r'^forms/(?P<form_id>[0-9]+)/data/$', views.FormDataList.as_view(), name='form-data-list'),
	url(r'^forms/(?P<pk>[0-9]+)/$', views.FormInstance.as_view(), name='form-detail'),
	url(r'^forms/$', views.FormList.as_view(), name='form-list'),
	url(r'^photos/(?P<pk>[0-9]+)/rotate-left/$', views.rotate_left, name='rotate-left'),
	url(r'^photos/(?P<pk>[0-9]+)/rotate-right/$', views.rotate_right, name='rotate-right'),
	url(r'^tags/$', views.TagList.as_view(), name='tags'),
	url(r'^tags/(?P<model_name_plural>\w+)/$', views.TagList.as_view(), name='tags'),
	
	#Todo: generalize this one:
	url(r'^forms/84/data/tracks/$', views.TrackList.as_view(), name='air-quality-tracks')
))


