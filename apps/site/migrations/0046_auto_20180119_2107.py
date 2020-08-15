# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import localground.apps.site.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0045_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='icon',
            name='media_file_new',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='icon',
            name='media_file_resized',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=''),
        ),
    ]
