from rest_framework import generics, status, exceptions
from localground.apps.site.api import serializers, filters
from localground.apps.site import models
from django.http import Http404, HttpResponse
from rest_framework.response import Response
from django.db import IntegrityError
from rest_framework.serializers import ValidationError


class RelatedMediaList(generics.ListCreateAPIView):
    # return HttpResponse(self.kwargs.get('entity_name_plural'))
    model = models.GenericAssociation
    serializer_class = serializers.AssociationSerializer
    # http://stackoverflow.com/questions/3210491/association-of-entities-in-a-rest-service

    def get_queryset(self):
        group_model = models.Base.get_model(
            model_name_plural=self.kwargs.get('group_name_plural')
        )
        try:
            marker = group_model.objects.get(
                id=int(
                    self.kwargs.get('source_id')))
        except group_model.DoesNotExist:
            raise Http404

        entity_type = models.Base.get_model(
            model_name_plural=self.kwargs.get('entity_name_plural')
        ).get_content_type()
        return self.model.objects.filter(
            entity_type=entity_type,
            source_type=group_model.get_content_type(),
            source_id=self.kwargs.get('source_id'))
    
    def perform_create(self, serializer):
        d = {}
        group_model = models.Base.get_model(
            model_name_plural=self.kwargs.get('group_name_plural')
        )
        source_type = group_model.get_content_type()
        entity_model = models.Base.get_model(
            model_name_plural=self.kwargs.get('entity_name_plural')
        )
        entity_type = entity_model.get_content_type()
        if self.kwargs.get('entity_name_plural') in [
                'markers',
                'views',
                'prints']:
            raise exceptions.ParseError(
                'You cannot attach a %s to a %s' % (
                    entity_model.model_name, group_model.model_name
                ))
        d.update({
            'source_type': source_type,
            'source_id': self.kwargs.get('source_id'),
            'entity_type': entity_type
        })
        try:
            serializer.save(**d)
        except IntegrityError as e:
            raise ValidationError({
                'non_field_errors': ['This relationship already exists in the system']
            })

class RelatedMediaInstance(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.GenericAssociation.objects.all()
    serializer_class = serializers.AssociationSerializerDetail

    def get_object(self, queryset=None):
        source_type = models.Base.get_model(
            model_name_plural=self.kwargs.get('group_name_plural')
        ).get_content_type()
        entity_type = models.Base.get_model(
            model_name_plural=self.kwargs.get('entity_name_plural')
        ).get_content_type()

        filter_kwargs = {
            'source_id': int(self.kwargs.get('source_id')),
            'entity_id': int(self.kwargs.get('id')),
            'source_type': source_type,
            'entity_type': entity_type
        }
        return generics.get_object_or_404(self.queryset, **filter_kwargs)
