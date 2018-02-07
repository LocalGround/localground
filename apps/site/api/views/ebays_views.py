from rest_framework import generics, serializers
from localground.apps.site import models
from localground.apps.lib.helpers.generic import FastPaginator
from rest_framework.permissions import AllowAny


class TrackNameSerializer(serializers.Serializer):
    name = serializers.CharField(source='col_4')


class TrackList(generics.ListAPIView):
    serializer_class = TrackNameSerializer
    paginate_by = 500
    paginator_class = FastPaginator
    permission_classes = (AllowAny, )

    def get_queryset(self):
        from django.db.models import Max
        form = models.Form.objects.get(id=84)
        return (models.Record.objects
                .distinct().filter(form=form).values('col_4')
                .annotate(time_max=Max('col_1'))
                .order_by('-time_max',))
