# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0026_auto_20170407_1433'),
    ]

    operations = [
        migrations.AddField(
            model_name='tileset',
            name='attribution',
            field=models.CharField(max_length=1000, null=True, blank=True),
        ),
    ]
