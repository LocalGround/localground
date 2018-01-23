# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0039_auto_20171121_1522'),
    ]

    operations = [
        migrations.AddField(
            model_name='photo',
            name='file_path_large',
            field=models.FileField(null=True, upload_to=b''),
        ),
        migrations.AddField(
            model_name='photo',
            name='file_path_marker_lg',
            field=models.FileField(null=True, upload_to=b''),
        ),
        migrations.AddField(
            model_name='photo',
            name='file_path_marker_sm',
            field=models.FileField(null=True, upload_to=b''),
        ),
        migrations.AddField(
            model_name='photo',
            name='file_path_medium',
            field=models.FileField(null=True, upload_to=b''),
        ),
        migrations.AddField(
            model_name='photo',
            name='file_path_medium_sm',
            field=models.FileField(null=True, upload_to=b''),
        ),
        migrations.AddField(
            model_name='photo',
            name='file_path_orig',
            field=models.FileField(null=True, upload_to=b''),
        ),
        migrations.AddField(
            model_name='photo',
            name='file_path_small',
            field=models.FileField(null=True, upload_to=b''),
        ),
    ]
