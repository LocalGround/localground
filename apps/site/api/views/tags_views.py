from rest_framework import generics, serializers
from tagging.models import Tag, TaggedItem
from localground.apps.site import models
from localground.apps.lib.helpers.generic import FastPaginator
from rest_framework.permissions import AllowAny
from localground.apps.site.api.views import *


class TagSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField('get_id')
    name = serializers.SerializerMethodField('get_name')
    count = serializers.SerializerMethodField('get_count')

    def get_id(self, obj):
        try:
            return obj.id
        except Exception:
            return obj.get('tag__id')

    def get_name(self, obj):
        try:
            return obj.name
        except Exception:
            return obj.get('tag__name')

    def get_count(self, obj):
        try:
            return obj.count
        except Exception:
            return obj.get('tag__count')


class TagList(generics.ListAPIView):
    # http://django-tagging.googlecode.com/svn/trunk/docs/overview.txt
    serializer_class = TagSerializer
    paginate_by = 100
    paginator_class = FastPaginator

    def get_queryset(self):
        if self.kwargs.get('model_name_plural') is None:
            from django.db.models import Count
            return (
                TaggedItem.objects
                .values('tag__name')
                .annotate(Count('tag'))
                .order_by('-tag__count')
            )
        else:
            model_class = models.Base.get_model(
                model_name_plural=self.kwargs.get('model_name_plural')
            )
            queryset = None
            if self.request.user.is_authenticated():
                queryset = model_class.objects.get_objects(self.request.user)
            else:
                queryset = model_class.objects.get_objects_public(
                    access_key=self.request.GET.get('access_key')
                )
            return Tag.objects.usage_for_queryset(queryset, counts=True)
            # return Tag.objects.cloud_for_model(model_class)
