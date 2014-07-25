from django.conf.urls import patterns, url
from django.conf.urls import include
from localground.apps.site.api import views
from localground.apps.site.api.views.user_profile_views import update_user_location
from localground.apps.site import models
from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns

entities = ['audio', 'photos', 'map-images']

# Create a router and register our viewsets with it.
router = DefaultRouter()
#router.register(r'audio', views.AudioViewSet)
#router.register(r'photos', views.PhotoViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
#router.register(r'map-images', views.ScanViewSet)
router.register(r'data-types', views.DataTypeViewSet)
router.register(r'tiles', views.TileViewSet)
#router.register(r'fields', views.FieldViewSet)
router.register(r'layouts', views.LayoutViewSet)
router.register(r'overlay-types', views.OverlayTypeViewSet)
router.register(r'overlay-sources', views.OverlaySourceViewSet)

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browseable API.
urlpatterns = patterns('',
                       url(r'^$', views.api_root),
                       # a hack to include both ViewSets and views on the front
                       # page
                       url(r'^', include(router.urls[1:])),
                       )

urlpatterns += format_suffix_patterns(patterns('',
	url(
		r'^(?P<group_name_plural>markers|views|prints)/(?P<source_id>[0-9]+)/(?P<entity_name_plural>\w+)/$',
		views.RelatedMediaList.as_view(),
		name='related-media-list'),
	url(
		r'^(?P<group_name_plural>markers|views|prints)/(?P<source_id>[0-9]+)/(?P<entity_name_plural>\w+)/(?P<id>[0-9]+)/$',
		views.RelatedMediaInstance.as_view(),
		name='related-media-detail'),
	url(
		r'^projects/(?P<pk>[0-9]+)/$',
		views.ProjectInstance.as_view(),
		name='project-detail'),
	url(r'^projects/$',
		views.ProjectList.as_view(),
		name='project-list'),
	url(
		r'^presentations/(?P<pk>[0-9]+)/$',
		views.PresentationInstance.as_view(),
		name='presentation-detail'),
	url(r'^presentations/$',
		views.PresentationList.as_view(),
		name='presentation-list'),
	url(
		r'^views/(?P<pk>[0-9]+)/$',
		views.ViewInstance.as_view(),
		name='view-detail'),
	url(r'^views/$',
		views.ViewList.as_view(),
		name='view-list'),
	url(
		r'^photos/(?P<pk>[0-9]+)/$',
		views.PhotoInstance.as_view(),
		name='photo-detail'),
	url(r'^photos/$',
		views.PhotoList.as_view(),
		name='photo-list'),
	url(
		r'^audio/(?P<pk>[0-9]+)/$',
		views.AudioInstance.as_view(),
		name='audio-detail'),
	url(r'^audio/$',
		views.AudioList.as_view(),
		name='audio-list'),
	url(
		r'^map-images/(?P<pk>[0-9]+)/$',
		views.ScanInstance.as_view(),
		name='scan-detail'),
	url(r'^map-images/$',
		views.ScanList.as_view(),
		name='scan-list'),
	url(
		r'^markers/(?P<pk>[0-9]+)/$',
		views.MarkerInstance.as_view(),
		name='marker-detail'),
	url(r'^markers/$',
		views.MarkerList.as_view(),
		name='marker-list'),
	url(
		r'^prints/(?P<pk>[0-9]+)/$',
		views.PrintInstance.as_view(),
		name='print-detail'),
	url(r'^prints/$',
		views.PrintList.as_view(),
		name='print-list'),
	url(
		r'^forms/(?P<form_id>[0-9]+)/data/(?P<pk>[0-9]+)/$',
		views.FormDataInstance.as_view(),
		name='form-data-instance'),
	url(
		r'^forms/(?P<form_id>[0-9]+)/data/$',
		views.FormDataList.as_view(),
		name='form-data-list'),
	url(
		r'^forms/(?P<pk>[0-9]+)/$',
		views.FormInstance.as_view(),
		name='form-detail'),
	url(r'^forms/$',
		views.FormList.as_view(),
		name='form-list'),
	url(
		r'^fields/(?P<pk>[0-9]+)/$',
		views.FieldInstance.as_view(),
		name='field-detail'),
	url(r'^fields/$',
		views.FieldList.as_view(),
		name='field-list'),
	url(
		r'^photos/(?P<pk>[0-9]+)/rotate-left/$',
		views.rotate_left,
		name='rotate-left'),
	url(
		r'^photos/(?P<pk>[0-9]+)/rotate-right/$',
		views.rotate_right,
		name='rotate-right'),
	url(r'^tags/$',
		views.TagList.as_view(),
		name='tags'),
	url(
		r'^tags/(?P<model_name_plural>\w+)/$',
		views.TagList.as_view(),
		name='tags'),
	url(r'^user-profile/$',
		views.UserProfileList.as_view(),
		name='userprofile-list'),
	url(
		r'^user-profile/(?P<pk>[0-9]+)/$',
		views.UserProfileInstance.as_view(),
		name='userprofile-detail'),
	url(r'^user-profile/update-location/$',
		update_user_location,
		name='userprofile-update-location'),
	# Todo: generalize this one:
	url(r'^forms/84/data/tracks/$',
		views.TrackList.as_view(),
		name='air-quality-tracks'),
	))
