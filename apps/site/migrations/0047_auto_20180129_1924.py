# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import localground.apps.site.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0046_auto_20180119_2107'),
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
            model_name='mapimage',
            name='media_file_scaled',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
        migrations.AddField(
            model_name='mapimage',
            name='media_file_thumb',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
    ]
