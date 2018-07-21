#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models import \
    NamedMixin, ProjectMixin, BaseAudit, Layer, Symbol
from jsonfield import JSONField
from localground.apps.site.managers import StyledMapManager
import json


class StyledMap(NamedMixin, ProjectMixin, BaseAudit):

    class Permissions(object):
        PUBLIC_SEARCHABLE = 1
        PUBLIC_UNLISTED = 2
        PASSWORD_PROTECTED = 3

    default_metadata = {
        'displayLegend': True,
        'nextPrevButtons': False,
        'allowPanZoom': True,
        'streetview': True,
        'displayTitleCard': True,
        'titleCardInfo': {
            'header': None,
            'description': None,
            'photo_ids': []
        },
        'accessLevel': Permissions.PUBLIC_UNLISTED
    }
    default_panel_styles = {
        'display_legend': True,
        'title': {
            'fw': 'bold',
            'color': '#ffffff',
            'backgroundColor': '#4e70d4',
            'font': 'Lato',
            'type': 'title',
            'size': '15'
        },
        'paragraph': {
            'fw': 'regular',
            'color': '#666',
            'backgroundColor': '#f0f1f5',
            'font': 'Lato',
            'type': 'paragraph',
            'size': '12'
        },
        'subtitle': {
            'fw': 'regular',
            'color': '#666',
            'backgroundColor': '#f7f7f7',
            'font': 'Lato',
            'type': 'subtitle',
            'size': '12'
        },
        'tags': {
            'fw': 'regular',
            'color': '#3d3d3d',
            'backgroundColor': '#f7f7f7',
            'font': 'Lato',
            'type': 'tags',
            'size': '10'
        }
    }
    center = models.PointField()
    password = models.CharField(max_length=255, null=True, blank=True)
    zoom = models.IntegerField()
    panel_styles = JSONField(
        blank=False, null=False,
        default=default_panel_styles)
    metadata = JSONField(
        blank=False, null=False,
        default=default_metadata)
    slug = models.SlugField(
        verbose_name="Friendly URL",
        max_length=100,
        db_index=True,
        help_text='Unique url identifier')
    basemap = models.ForeignKey('TileSet', default=1)  # default to grayscale
    filter_fields = BaseAudit.filter_fields + \
        ('slug', 'name', 'description', 'tags', 'owner', 'project')
    objects = StyledMapManager()

    def get_metadata(self):
        import json
        if isinstance(self.metadata, basestring):
            return json.loads(self.metadata)
        else:
            return self.metadata

    def _get_access_level(self):
        return self.get_metadata().get('accessLevel')

    def is_password_protected(self):
        return self._get_access_level() == StyledMap.Permissions.PASSWORD_PROTECTED

    def is_public_unlisted(self):
        return self._get_access_level() == StyledMap.Permissions.PUBLIC_UNLISTED

    def is_public_searchable(self):
        return self._get_access_level() == StyledMap.Permissions.PUBLIC_SEARCHABLE

    @property
    def layers(self):
        if not hasattr(self, '_layers') or self._layers is None:
            self._layers = list(
                Layer.objects.select_related('dataset', 'display_field')
                .filter(styled_map=self).order_by('ordering', )
            )
        return self._layers

    def can_view(self, user, access_key=None):
        # all maps are viewable
        return True

    def __str__(self):
        # return '%s - %s' % self.id, self.name
        return self.name

    def delete(self, **kwargs):
        # this code is needed to delete empty datasets
        # associated with child layers:
        for layer in self.layers:
            layer.delete()
        super(StyledMap, self).delete(**kwargs)

    @classmethod
    def create(cls, datasets=None, **kwargs):
        # create map:
        map = StyledMap.objects.create(**kwargs)

        # create layers:
        if datasets:
            i = 1
            for dataset in datasets:
                layer = Layer.create(
                    last_updated_by=kwargs.get('last_updated_by'),
                    owner=kwargs.get('owner'),
                    title='Untitled Layer {0}'.format(i),
                    styled_map=map,
                    project=map.project,
                    dataset=dataset,
                    group_by='uniform',
                    symbols=[
                        Symbol.SIMPLE.to_dict()
                    ],
                    display_field=dataset.fields[0],
                    ordering=i
                )
                i += 1
        else:
            layer = Layer.create(
                last_updated_by=kwargs.get('last_updated_by'),
                owner=kwargs.get('owner'),
                title='Layer 1',
                styled_map=map,
                group_by='uniform',
                symbols=[
                    Symbol.SIMPLE.to_dict()
                ],
                project=map.project,
                ordering=1
            )
        return map

    class Meta:
        app_label = 'site'
        verbose_name = 'styled_map'
        verbose_name_plural = 'styled_maps'
        unique_together = ('slug', 'owner')
