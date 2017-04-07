# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0024_tileset'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tileset',
            name='static_url',
            field=models.CharField(max_length=2000, blank=True),
        ),
        migrations.AlterField(
            model_name='tileset',
            name='tile_url',
            field=models.CharField(max_length=2000, blank=True),
        ),
    ]
