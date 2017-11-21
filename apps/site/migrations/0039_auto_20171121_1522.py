# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0038_audio_uploaded_file'),
    ]

    operations = [
        migrations.RenameField(
            model_name='audio',
            old_name='uploaded_file',
            new_name='media_file',
        ),
        migrations.AddField(
            model_name='audio',
            name='media_file_orig',
            field=models.FileField(null=True, upload_to=b''),
        ),
    ]
