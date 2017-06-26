# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0025_merge'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imageopts',
            name='center',
        ),
        migrations.RemoveField(
            model_name='imageopts',
            name='northeast',
        ),
        migrations.RemoveField(
            model_name='imageopts',
            name='southwest',
        ),
        migrations.RemoveField(
            model_name='imageopts',
            name='zoom',
        ),
        migrations.RemoveField(
            model_name='print',
            name='center',
        ),
        migrations.RemoveField(
            model_name='print',
            name='northeast',
        ),
        migrations.RemoveField(
            model_name='print',
            name='southwest',
        ),
        migrations.RemoveField(
            model_name='print',
            name='zoom',
        ),
        migrations.AlterField(
            model_name='imageopts',
            name='extents',
            field=django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='print',
            name='extents',
            field=django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True),
        ),
    ]
