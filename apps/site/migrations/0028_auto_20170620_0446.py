# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0027_auto_20170618_2335'),
    ]

    operations = [
        migrations.AddField(
            model_name='print',
            name='center',
            field=django.contrib.gis.db.models.fields.PointField(srid=4326, null=True),
        ),
        migrations.AddField(
            model_name='print',
            name='northeast',
            field=django.contrib.gis.db.models.fields.PointField(srid=4326, null=True),
        ),
        migrations.AddField(
            model_name='print',
            name='southwest',
            field=django.contrib.gis.db.models.fields.PointField(srid=4326, null=True),
        ),
        migrations.AddField(
            model_name='print',
            name='zoom',
            field=models.IntegerField(null=True),
        ),
    ]
