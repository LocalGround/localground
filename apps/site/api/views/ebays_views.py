from rest_framework import generics, serializers
from localground.apps.site import models
from localground.apps.lib.helpers.generic import FastPaginator

class TrackNameSerializer(serializers.Serializer):
	name = serializers.CharField(source='col_4')

class TrackList(generics.ListAPIView):
	serializer_class = TrackNameSerializer
	paginate_by = 500
	paginator_class = FastPaginator
	
	def get_queryset(self):
		from django.db.models import Max
		form = models.Form.objects.get(id=84)
		return (form.TableModel.objects
					.distinct().values('col_4')
					.annotate(time_max=Max('col_1'))
					.order_by('-time_max',))
	
	

	