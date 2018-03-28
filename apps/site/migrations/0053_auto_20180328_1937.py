# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0052_auto_20180327_0128'),
    ]

    operations = [
        migrations.AddField(
            model_name='layer',
            name='display_field',
            field=models.ForeignKey(related_name='layer+', default=1, to='site.Field'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='layer',
            name='symbols',
            field=jsonfield.fields.JSONField(default=b'[{"strokeWeight": 1, "strokeOpacity": 1, "height": 20, "shape": "circle", "fillOpacity": 1, "strokeColor": "#ffffff", "id": 1, "title": "Untitled Layer", "isShowing": true, "rule": "*", "width": 20, "fillColor": "#4e70d4"}]', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='styledmap',
            name='panel_styles',
            field=jsonfield.fields.JSONField(default=b'{"display_legend": true, "paragraph": {"fw": "regular", "color": "#666", "backgroundColor": "#f0f1f5", "font": "Lato", "type": "paragraph", "size": "12"}, "subtitle": {"fw": "regular", "color": "#666", "backgroundColor": "#f7f7f7", "font": "Lato", "type": "subtitle", "size": "12"}, "tags": {"fw": "regular", "color": "#3d3d3d", "backgroundColor": "#f7f7f7", "font": "Lato", "type": "tags", "size": "10"}, "title": {"fw": "bold", "color": "#ffffff", "backgroundColor": "#4e70d4", "font": "Lato", "type": "title", "size": "15"}}'),
        ),
        migrations.AlterField(
            model_name='styledmap',
            name='slug',
            field=models.SlugField(help_text=b'Unique url identifier', max_length=100, verbose_name=b'Friendly URL'),
        ),
    ]
