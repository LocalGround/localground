# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0030_video_attribution'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audio',
            name='attribution',
            field=models.CharField(help_text='Name of the person who created the media file (text)', max_length=500, null=True, verbose_name='Author / Creator', blank=True),
        ),
        migrations.AlterField(
            model_name='mapimage',
            name='attribution',
            field=models.CharField(help_text='Name of the person who created the media file (text)', max_length=500, null=True, verbose_name='Author / Creator', blank=True),
        ),
        migrations.AlterField(
            model_name='photo',
            name='attribution',
            field=models.CharField(help_text='Name of the person who created the media file (text)', max_length=500, null=True, verbose_name='Author / Creator', blank=True),
        ),
    ]
