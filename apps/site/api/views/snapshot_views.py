from rest_framework import generics, status
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import QueryableListCreateAPIView
from localground.apps.site import models
from localground.apps.site.api.permissions import CheckProjectPermissions
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.http import HttpResponse

class SnapshotMixin(object):

    def save_generic_relations(self, obj, entities):
        '''
        Saves all children:
        '''
        from localground.apps.lib.helpers import get_timestamp_no_milliseconds
        import json
        from django.db import connection, IntegrityError, DatabaseError
        if entities:
            entities = json.loads(entities)
            source_type = self.model.get_content_type()
            source_id = obj.id
            # 1) clear out existing child media:
            obj.entities.all().delete()

            # 2) attach new child media:
            for child in entities:
                overlay_type = child.get('overlay_type')
                entity_type = models.Base.get_model(
                    model_name=overlay_type
                ).get_content_type()
                for id in child.get('ids'):
                    a = models.GenericAssociation(
                        source_id=source_id,
                        source_type=source_type,
                        entity_id=id,  # entity['id'],
                        entity_type=entity_type,
                        owner=self.request.user,
                        last_updated_by=self.request.user,
                        time_stamp=get_timestamp_no_milliseconds(),
                        turned_on=True,
                    )
                    try:
                        a.save()
                    except IntegrityError as e:
                        self.warnings.append('duplicates removed')
                        connection._rollback()


class SnapshotList(QueryableListCreateAPIView, SnapshotMixin):
    error_messages = {}
    warnings = []
    serializer_class = serializers.SnapshotSerializer
    filter_backends = (filters.SQLFilterBackend,)
    model = models.Snapshot
    paginate_by = 100

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return self.model.objects.get_objects(self.request.user)
        else:
            return self.model.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )

    def perform_create(self, serializer):
        d = {
            'access_authority': models.ObjectAuthority.objects.get(id=3)
        }
        obj = serializer.save(**d)
        self.save_generic_relations(obj, serializer.initial_data.get('entities'))
        

    def post_save(self, obj, created=False):
        SnapshotMixin.post_save(self, obj, created=False)



class SnapshotInstance(
        SnapshotMixin, generics.RetrieveUpdateDestroyAPIView):
    error_messages = {}
    warnings = []
    queryset = models.Snapshot.objects.select_related('owner').all()
    serializer_class = serializers.SnapshotDetailSerializer
    model = models.Snapshot

    def perform_update(self, serializer):
        obj = serializer.save()
        self.save_generic_relations(obj, serializer.initial_data.get('entities'))

