# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0059_auto_20180330_2109'),
    ]

    operations = [
        migrations.AlterField(
            model_name='layer',
            name='group_by',
            field=models.CharField(max_length=255),
        ),
    ]
