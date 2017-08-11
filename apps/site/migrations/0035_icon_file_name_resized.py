# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0034_auto_20170811_1758'),
    ]

    operations = [
        migrations.AddField(
            model_name='icon',
            name='file_name_resized',
            field=models.CharField(default=50, max_length=255),
            preserve_default=False,
        ),
    ]
