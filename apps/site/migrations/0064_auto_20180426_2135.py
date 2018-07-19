# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import django.contrib.gis.db.models.fields

class Migration(migrations.Migration):

    dependencies = [
        ('site', '0063_auto_20180423_2302'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='field',
            options={'ordering': ['dataset__id', 'ordering'], 'verbose_name': 'field', 'verbose_name_plural': 'fields'},
        ),
        migrations.AlterField(
            model_name='layer',
            name='symbols',
            field=jsonfield.fields.JSONField(default=[{b'strokeWeight': 1, b'strokeOpacity': 1, b'height': 25, b'shape': b'circle', b'fillOpacity': 1, b'strokeColor': b'#ffffff', b'title': b'Untitled Symbol', b'isShowing': True, b'rule': b'*', b'width': 25, b'fillColor': b'rgb(177, 89, 40)'}], null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='default_location',
            field=django.contrib.gis.db.models.fields.PointField(help_text=b'Default center point', srid=4326, null=True, blank=True),
        )
    ]
