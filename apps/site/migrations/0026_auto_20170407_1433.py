# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0025_auto_20170407_1424'),
    ]

    operations = [
        migrations.AddField(
            model_name='tileset',
            name='extras',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='tileset',
            name='key',
            field=models.CharField(max_length=512, null=True, blank=True),
        ),
    ]
