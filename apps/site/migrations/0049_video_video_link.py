# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0048_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='video_link',
            field=models.CharField(default='https://www.youtube.com/watch?v=jNQXAC9IVRw', max_length=255),
            preserve_default=False,
        ),
    ]
