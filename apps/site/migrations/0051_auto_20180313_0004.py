# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0050_merge'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imageopts',
            name='file_path_s3',
        ),
        migrations.RenameField(
            model_name='layer',
            new_name='group_by',
            old_name='layer_type')
    ]
