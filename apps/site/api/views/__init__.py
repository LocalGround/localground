from localground.apps.site.api.views.audio_views import AudioList, AudioInstance
from localground.apps.site.api.views.mapimage_views import MapImageList, MapImageInstance
from localground.apps.site.api.views.photo_views import (
    PhotoList, PhotoInstance, rotate_left, rotate_right
)
from localground.apps.site.api.views.presentation_views import PresentationList, PresentationInstance
from localground.apps.site.api.views.print_views import PrintList, PrintInstance, LayoutViewSet
from localground.apps.site.api.views.project_views import ProjectList, ProjectInstance
from localground.apps.site.api.views.sharing_views import SharingList, SharingInstance
from localground.apps.site.api.views.snapshot_views import SnapshotList, SnapshotInstance
from localground.apps.site.api.views.layer_views import LayerList, LayerInstance

from localground.apps.site.api.views.marker_views import MarkerList, MarkerInstance
from localground.apps.site.api.views.association_views import (
    RelatedMediaList, RelatedMediaInstance
)
from localground.apps.site.api.views.ebays_views import TrackList
from localground.apps.site.api.views.field_views import FieldList, FieldInstance
from localground.apps.site.api.views.form_views import FormList, FormInstance
from localground.apps.site.api.views.form_data_views import (
    FormDataList, FormDataInstance
)
from localground.apps.site.api.views.admin_views import (
    TileViewSet, OverlayTypeViewSet, OverlaySourceViewSet,
    UserViewSet, GroupViewSet, DataTypeViewSet
)
from localground.apps.site.api.views.tags_views import TagList
from localground.apps.site.api.views.user_profile_views import UserProfileList, UserProfileInstance

from rest_framework.decorators import api_view
from collections import OrderedDict
from rest_framework.response import Response
from rest_framework.reverse import reverse


@api_view(('GET',))
def api_root(request, format=None, **kwargs):
    d = OrderedDict()
    d['audio'] = reverse('audio-list', request=request, format=format)
    d['forms'] = reverse('form-list', request=request, format=format)
    d['groups'] = reverse('group-list', request=request, format=format)
    d['layouts'] = reverse('layout-list', request=request, format=format)
    d['data-types'] = reverse('datatype-list', request=request, format=format)
    d['markers'] = reverse('marker-list', request=request, format=format)
    d['map-images'] = reverse('mapimage-list', request=request, format=format)
    d['overlay-sources'] = reverse('overlaysource-list',
                                   request=request,
                                   format=format)
    d['overlay-types'] = reverse('overlaytype-list',
                                 request=request,
                                 format=format)
    d['photos'] = reverse('photo-list', request=request, format=format)
    d['presentations'] = reverse(
        'presentation-list',
        request=request,
        format=format)
    d['prints'] = reverse('print-list', request=request, format=format)
    d['projects'] = reverse('project-list', request=request, format=format)
    d['snapshots'] = reverse('snapshot-list', request=request, format=format)
    d['layers'] = reverse('layer-list', request=request, format=format)
    d['tags'] = reverse('tag-list', request=request, format=format)
    d['tiles'] = reverse('wmsoverlay-list', request=request, format=format)
    d['users'] = reverse('user-list', request=request, format=format)
    d['userprofiles'] = reverse('userprofile-list',
                                    request=request,
                                    format=format)
    return Response(d)
