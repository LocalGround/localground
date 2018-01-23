# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0040_auto_20171128_1951'),
    ]

    operations = [
        migrations.RenameField(
            model_name='photo',
            old_name='file_path_large',
            new_name='media_file_large',
        ),
        migrations.RenameField(
            model_name='photo',
            old_name='file_path_marker_lg',
            new_name='media_file_marker_lg',
        ),
        migrations.RenameField(
            model_name='photo',
            old_name='file_path_marker_sm',
            new_name='media_file_marker_sm',
        ),
        migrations.RenameField(
            model_name='photo',
            old_name='file_path_medium',
            new_name='media_file_medium',
        ),
        migrations.RenameField(
            model_name='photo',
            old_name='file_path_medium_sm',
            new_name='media_file_medium_sm',
        ),
        migrations.RenameField(
            model_name='photo',
            old_name='file_path_orig',
            new_name='media_file_orig',
        ),
        migrations.RenameField(
            model_name='photo',
            old_name='file_path_small',
            new_name='media_file_small',
        ),
    ]
