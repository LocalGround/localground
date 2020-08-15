from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from django.conf.urls import include
from localground.apps.site.api import views
from localground.apps.site import models
from rest_framework.routers import DefaultRouter
from rest_framework.urlpatterns import format_suffix_patterns

from django.urls import path, re_path

entities = ['audio', 'photos', 'map-images']

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'data-types', views.DataTypeViewSet)
router.register(r'layouts', views.LayoutViewSet)
router.register(r'overlay-sources', views.OverlaySourceViewSet)

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browseable API.
urlpatterns = [
    re_path(r'^$', views.api_root),
    # a hack to include both ViewSets and views on the front
    # page
    re_path(r'^', include(router.urls[1:])),
]

urlpatterns += format_suffix_patterns([
    re_path(
        r'^usernames/$',
        views.ListUsernames.as_view(),
        name="usernames"),
    re_path(
        r'^(?P<group_name_plural>prints)/(?P<source_id>[0-9]+)/(?P<entity_name_plural>\w+)/$',
        views.RelatedMediaList.as_view(),
        name='related-media-list'),
    re_path(
        r'^(?P<group_name_plural>prints)/(?P<source_id>[0-9]+)/(?P<entity_name_plural>\w+)/(?P<id>[0-9]+)/$',
        views.RelatedMediaInstance.as_view(),
        name='related-media-detail'),
    re_path(
        r'^datasets/(?P<group_name_plural>[0-9]+)/data/(?P<source_id>[0-9]+)/(?P<entity_name_plural>\w+)/$',
        views.RelatedMediaList.as_view(),
        name='related-media-list'),
    re_path(
        r'^datasets/(?P<group_name_plural>[0-9]+)/data/(?P<source_id>[0-9]+)/(?P<entity_name_plural>\w+)/(?P<id>[0-9]+)/$',
        views.RelatedMediaInstance.as_view(),
        name='related-media-detail'),
    re_path(
        r'^projects/(?P<project_id>[0-9]+)/users/(?P<username>\w+)/$',
        views.SharingInstance.as_view(),
        name='userauthorityobject-detail'),
    re_path(
        r'^projects/(?P<project_id>[0-9]+)/users/$',
        views.SharingList.as_view(),
        name='userauthorityobject-list'),
    re_path(
        r'^projects/(?P<pk>[0-9]+)/$',
        views.ProjectInstance.as_view(),
        name='project-detail'),
    re_path(r'^projects/$',
        views.ProjectList.as_view(),
        name='project-list'),
    #url(
    #    r'^layers/(?P<pk>[0-9]+)/$',
    #    views.LayerInstance.as_view(),
    #    name='layer-detail'),
    #url(r'^layers/$',
    #    views.LayerList.as_view(),
    #    name='layer-list'),
    re_path(
        r'^maps/(?P<map_id>[0-9]+)/layers/(?P<pk>[0-9]+)/$',
        views.LayerInstance.as_view(),
        name='layer-detail'),
    re_path(
        r'^maps/(?P<map_id>[0-9]+)/layers/$',
        views.LayerList.as_view(),
        name='layer-list'),
    re_path(
        r'^maps/(?P<pk>[0-9]+)/$',
        views.MapInstance.as_view(),
        name='map-detail'),
    re_path(
        r'^maps/(?P<slug>[\w-]+)/$',
        views.MapInstanceSlug.as_view(),
        name='map-detail-slug'),
    re_path(r'^maps/$',
        views.MapList.as_view(),
        name='map-list'),
    re_path(
        r'^photos/(?P<pk>[0-9]+)/$',
        views.PhotoInstance.as_view(),
        name='photo-detail'),
    re_path(r'^photos/$',
        views.PhotoList.as_view(),
        name='photo-list'),
    re_path(
        r'^icons/(?P<pk>[0-9]+)/$',
        views.IconInstance.as_view(),
        name='icon-detail'),
    re_path(r'^icons/$',
        views.IconList.as_view(),
        name='icon-list'),
    re_path(
        r'^audio/(?P<pk>[0-9]+)/$',
        views.AudioInstance.as_view(),
        name='audio-detail'),
    re_path(r'^audio/$',
        views.AudioList.as_view(),
        name='audio-list'),
    re_path(
        r'^map-images/(?P<map_id>[0-9]+)/overlays/$',
        views.MapImageOverlayList.as_view(),
        name='imageopts-list'),
    re_path(
        r'^map-images/(?P<map_id>[0-9]+)/overlays/(?P<pk>[0-9]+)/$',
        views.MapImageOverlayInstance.as_view(),
        name='imageopts-detail'),
    re_path(
        r'^map-images/(?P<pk>[0-9]+)/$',
        views.MapImageInstance.as_view(),
        name='mapimage-detail'),
    re_path(r'^map-images/$',
        views.MapImageList.as_view(),
        name='mapimage-list'),
    re_path(
        r'^datasets/(?P<dataset_id>[0-9]+)/data/(?P<pk>[0-9]+)/$',
        views.RecordInstance.as_view()),
    re_path(r'^datasets/(?P<dataset_id>[0-9]+)/data/$',
        views.RecordList.as_view()),
    re_path(
        r'^prints/(?P<pk>[0-9]+)/$',
        views.PrintInstance.as_view(),
        name='print-detail'),
    re_path(r'^prints/$',
        views.PrintList.as_view(),
        name='print-list'),
    re_path(
        r'^datasets/(?P<dataset_id>[0-9]+)/fields/(?P<pk>[0-9]+)/$',
        views.FieldInstance.as_view(),
        name='field-detail'),
    re_path(
        r'^datasets/(?P<dataset_id>[0-9]+)/fields/$',
        views.FieldList.as_view(),
        name='field-list'),
    re_path(
        r'^datasets/(?P<pk>[0-9]+)/$',
        views.DatasetInstance.as_view(),
        name='dataset-detail'),
    re_path(r'^datasets/$',
        views.DatasetList.as_view(),
        name='dataset-list'),
    re_path(
        r'^photos/(?P<pk>[0-9]+)/rotate-left/$',
        views.rotate_left,
        name='rotate-left'),
    re_path(
        r'^photos/(?P<pk>[0-9]+)/rotate-right/$',
        views.rotate_right,
        name='rotate-right'),
    re_path(r'^tags/(?P<term>\w+)/$',
        views.TagList.as_view(),
        name='tag-list'),
    re_path(r'^tags/$',
        views.TagList.as_view(),
        name='tag-list'),
    re_path(r'^user-profile/$',
        views.UserProfileList.as_view(),
        name='userprofile-list'),
    re_path(
        r'^user-profile/(?P<pk>[0-9]+)/$',
        views.UserProfileInstance.as_view(),
        name='userprofile-detail'),
    re_path(
        r'^tiles/(?P<pk>[0-9]+)/$',
        views.TileSetInstance.as_view(),
        name='tileset-detail'),
    re_path(r'^tiles/$',
        views.TileSetList.as_view(),
        name='tileset-list'),
    # Todo: generalize this one:
    re_path(r'^datasets/84/data/tracks/$',
        views.TrackList.as_view(),
        name='air-quality-tracks'),
    re_path(r'^videos/$', views.VideoList.as_view(),
        name='video-list'),
    re_path(r'^videos/(?P<pk>[0-9]+)/$', views.VideoInstance.as_view(),
        name='video-detail'),
])

if settings.DEBUG:
    # Store static CSS, JS, etc. locally:
    urlpatterns += static('/static/', document_root=settings.STATIC_ROOT)
