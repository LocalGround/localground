from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate
from localground.apps.site.api.views.audio_views import AudioList, AudioInstance
from localground.apps.site.api.views.scan_views import ScanList, ScanInstance
from localground.apps.site.api.views.photo_views import (
    PhotoList, PhotoInstance, rotate_left, rotate_right
)
from localground.apps.site.api.views.print_views import PrintList, PrintInstance, LayoutViewSet
from localground.apps.site.api.views.project_views import ProjectList, ProjectInstance
from localground.apps.site.api.views.view_views import ViewList, ViewInstance
from localground.apps.site.api.views.marker_views import MarkerList, MarkerInstance
from localground.apps.site.api.views.association_views import (
    RelatedMediaList, RelatedMediaInstance
)
from localground.apps.site.api.views.ebays_views import TrackList
from localground.apps.site.api.views.form_views import (
    FormList, FormInstance, FormDataList, FormDataInstance
)
from localground.apps.site.api.views.admin_views import (
    TileViewSet, OverlayTypeViewSet, OverlaySourceViewSet,
    UserViewSet, GroupViewSet, DataTypeViewSet
)
from localground.apps.site.api.views.tags_views import TagList
from localground.apps.site.api.views.user_profile_views import UserProfileList, UserProfileInstance

from rest_framework.decorators import api_view
from django.utils.datastructures import SortedDict
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(('GET',))
def api_root(request, format=None, **kwargs):
    d = SortedDict()
    d['audio'] = reverse('audio-list', request=request, format=format)
    d['forms'] = reverse('form-list', request=request, format=format)
    d['groups'] = reverse('group-list', request=request, format=format)
    d['layouts'] = reverse('layout-list', request=request, format=format)
    d['data-types'] = reverse('datatype-list', request=request, format=format)
    d['markers'] = reverse('marker-list', request=request, format=format)
    d['map-images'] = reverse('scan-list', request=request, format=format)
    d['overlay-sources'] = reverse('overlaysource-list', request=request, format=format)
    d['overlay-types'] = reverse('overlaytype-list', request=request, format=format)
    d['photos'] = reverse('photo-list', request=request, format=format)
    d['prints'] = reverse('print-list', request=request, format=format)
    d['projects'] = reverse('project-list', request=request, format=format)
    d['views'] = reverse('view-list', request=request, format=format)
    d['tiles'] = reverse('wmsoverlay-list', request=request, format=format)
    d['users'] = reverse('user-list', request=request, format=format)
    d['userprofile-list'] = reverse('userprofile-list', request=request, format=format)
    return Response(d)
