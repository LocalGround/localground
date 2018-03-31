# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0060_record_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='layer',
            name='group_by',
            field=models.CharField(max_length=255),
        ),
    ]
