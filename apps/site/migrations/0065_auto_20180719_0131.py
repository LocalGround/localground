# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0064_auto_20180426_2135'),
    ]

    operations = [
        migrations.AddField(
            model_name='styledmap',
            name='metadata',
            field=jsonfield.fields.JSONField(),
        ),
        migrations.AlterField(
            model_name='layer',
            name='metadata',
            field=jsonfield.fields.JSONField(default='{"width": 20, "shape": "circle", "fillOpacity": 1, "fillColor": "#4e70d4", "strokeWeight": 1, "buckets": 4, "isShowing": true, "strokeColor": "#ffffff", "strokeOpacity": 1, "paletteId": 0}', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='layer',
            name='symbols',
            field=jsonfield.fields.JSONField(default=[{b'strokeWeight': 1, b'strokeOpacity': 1, b'height': 25, b'shape': b'circle', b'fillOpacity': 1, b'strokeColor': b'#ffffff', b'title': b'All items', b'isShowing': True, b'rule': b'*', b'width': 25, b'fillColor': b'rgb(202, 178, 214)'}], null=True, blank=True),
        )
    ]
