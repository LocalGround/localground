from localground.apps.site.api.views.audio_views import \
    AudioList, AudioInstance
from localground.apps.site.api.views.icon_views import IconList, IconInstance

from localground.apps.site.api.views.video_views import \
    VideoList, VideoInstance
from localground.apps.site.api.views.mapimage_views import \
    MapImageList, MapImageInstance
from localground.apps.site.api.views.mapimage_overlay_views import \
    MapImageOverlayList, MapImageOverlayInstance

from localground.apps.site.api.views.photo_views import (
    PhotoList, PhotoInstance, rotate_left, rotate_right
)
from localground.apps.site.api.views.print_views import \
    PrintList, PrintInstance, LayoutViewSet
from localground.apps.site.api.views.project_views import \
    ProjectList, ProjectInstance
from localground.apps.site.api.views.sharing_views import \
    SharingList, SharingInstance
from localground.apps.site.api.views.layer_views import \
    LayerList, LayerInstance
from localground.apps.site.api.views.map_views import \
    MapList, MapInstance, MapInstanceSlug

# from localground.apps.site.api.views.marker_views import \
#     MarkerList, MarkerInstance

from localground.apps.site.api.views.marker_w_attrs_views \
    import MarkerWAttrsList, MarkerWAttrsInstance


from localground.apps.site.api.views.association_views import (
    RelatedMediaList, RelatedMediaInstance
)
from localground.apps.site.api.views.ebays_views import TrackList
from localground.apps.site.api.views.field_views import \
    FieldList, FieldInstance
from localground.apps.site.api.views.form_views import FormList, FormInstance
from localground.apps.site.api.views.tile_views import \
    TileSetList, TileSetInstance
from localground.apps.site.api.views.admin_views import (
    OverlaySourceViewSet, UserViewSet, GroupViewSet, DataTypeViewSet,
    ListUsernames
)
from localground.apps.site.api.views.tags_views import TagList
from localground.apps.site.api.views.user_profile_views import \
    UserProfileList, UserProfileInstance

from rest_framework.decorators import api_view
from collections import OrderedDict
from rest_framework.response import Response
from rest_framework.reverse import reverse


@api_view(('GET',))
def api_root(request, format=None, **kwargs):
    d = {}
    d['audio'] = reverse('audio-list', request=request, format=format)
    d['datasets'] = reverse('form-list', request=request, format=format)
    d['groups'] = reverse('group-list', request=request, format=format)
    d['icons'] = reverse('icon-list', request=request, format=format)

    d['layouts'] = reverse('layout-list', request=request, format=format)
    d['data-types'] = reverse('datatype-list', request=request, format=format)
    #d['markers'] = reverse('record-list', request=request, format=format)
    d['map-images'] = reverse('mapimage-list', request=request, format=format)
    d['overlay-sources'] = reverse('overlaysource-list',
                                   request=request,
                                   format=format)
    d['photos'] = reverse('photo-list', request=request, format=format)
    d['videos'] = reverse('video-list', request=request, format=format)
    d['prints'] = reverse('print-list', request=request, format=format)
    d['projects'] = reverse('project-list', request=request, format=format)
    d['maps'] = reverse('map-list', request=request, format=format)
    d['tags'] = reverse('tag-list', request=request, format=format)
    d['tiles'] = reverse('tileset-list', request=request, format=format)
    d['users'] = reverse('user-list', request=request, format=format)
    d['userprofiles'] = reverse(
        'userprofile-list', request=request, format=format)
    return Response(OrderedDict(sorted(d.items())))
