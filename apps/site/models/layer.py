#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import BaseAudit
from localground.apps.site.models.symbol import Symbol
from jsonfield import JSONField
import json


class Layer(BaseAudit):
    default_metadata = {
        'buckets': 4,
        'paletteId': 0,
        'fillOpacity': 1,
        'width': 25,
        'fillColor': '#4e70d4',
        'strokeColor': '#ffffff',
        'strokeWeight': 1,
        'strokeOpacity': 1,
        'shape': 'circle',
        'isShowing': True
    }
    styled_map = models.ForeignKey('StyledMap', related_name='%(class)s+')
    dataset = models.ForeignKey('Dataset', related_name='%(class)s+')
    display_field = models.ForeignKey('Field', related_name='%(class)s+')
    title = models.CharField(max_length=255, null=False, blank=False)
    ordering = models.IntegerField()
    group_by = models.CharField(max_length=255)
    metadata = JSONField(
        blank=True,
        null=True,
        default=json.dumps(default_metadata)
    )
    symbols = JSONField(blank=True, null=True, default=[
        Symbol.SIMPLE.to_dict()
    ])

    @classmethod
    def create(cls, dataset=None, **kwargs):
        # print kwargs

        if dataset is None:
            # if no dataset is passed in, create a new one:
            from localground.apps.site.models import Dataset
            dataset = Dataset.create(
                owner=kwargs.get('owner'),
                last_updated_by=kwargs.get('last_updated_by'),
                project=kwargs.get('project')
            )
        if not kwargs.get('display_field'):
            kwargs['display_field'] = dataset.fields[0]
        if not kwargs.get('title'):
            kwargs['title'] = 'Untitled Layer'
        kwargs.pop('project')
        layer = Layer.objects.create(dataset=dataset, **kwargs)

        # coordinate symbol with layer metadata:
        metadata = json.loads(layer.metadata)
        metadata['fillColor'] = layer.symbols[0]['fillColor']
        metadata['shape'] = layer.symbols[0]['shape']
        self.instance.metadata = json.dumps(metadata)
        layer.save()

        return layer

    def can_view(self, user, access_key=None):
        # all layer are viewable
        return True

    def can_edit(self, user):
        return self.styled_map.can_edit(user)

    def to_dict(self):
        from localground.apps.site.api.serializers import LayerDetailSerializer
        return LayerDetailSerializer(self, context={'request': {}}).data

    def delete(self, **kwargs):
        super(Layer, self).delete(**kwargs)
        # print len(self.dataset.get_records())
        # print len(self.dataset.get_linked_layers())
        if len(self.dataset.get_records()) == 0 and \
                len(self.dataset.get_linked_layers()) == 0:
            '''
            print 'Dataset id={0} is stale and empty. Deleting it...'.format(
                self.dataset.id
            )
            '''
            self.dataset.delete()

    class Meta:
        app_label = 'site'

    def __unicode__(self):
        return '{0}. {1}'.format(self.id, self.title)
