# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import localground.apps.site.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0047_merge'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='icon',
            name='file_name_new',
        ),
        migrations.RemoveField(
            model_name='icon',
            name='file_name_resized',
        ),
        migrations.AddField(
            model_name='imageopts',
            name='file_path_s3',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
    ]
