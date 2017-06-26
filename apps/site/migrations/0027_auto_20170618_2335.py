# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0026_auto_20170618_2259'),
    ]

    operations = [
        migrations.AddField(
            model_name='imageopts',
            name='name',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='imageopts',
            name='opacity',
            field=models.FloatField(default=1),
        ),
    ]
