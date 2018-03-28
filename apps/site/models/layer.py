#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import BaseAudit
from localground.apps.site.models.symbol import Symbol
from jsonfield import JSONField
import json


class Layer(BaseAudit):
    styled_map = models.ForeignKey('StyledMap', related_name='%(class)s+')
    dataset = models.ForeignKey('Form', related_name='%(class)s+')
    display_field = models.ForeignKey('Field', related_name='%(class)s+')
    title = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    # data_source = models.TextField(null=True, blank=True)
    # group_by = models.CharField(max_length=64)
    metadata = JSONField(blank=True, null=True)
    symbols = JSONField(
        blank=True, null=True, default=[Symbol.SIMPLE.to_JSON()])

    @classmethod
    def create(cls, **kwargs):

        if kwargs.get('dataset') is None:
            # if no dataset is passed in, create a new one:
            from localground.apps.site.models import Form
            dataset = Form.objects.create(
                owner=kwargs.get('owner'),
                name='Untitled Dataset',
                last_updated_by=kwargs.get('last_updated_by'),
                project=kwargs.get('project')
            )
            kwargs['dataset'] = dataset

        kwargs.pop('project')
        return Layer.objects.create(**kwargs)

    def can_view(self, user, access_key=None):
        # all layer are viewable
        return True

    def can_edit(self, user):
        return self.styled_map.can_edit(user)

    class Meta:
        app_label = 'site'
        unique_together = ('title', 'styled_map')
