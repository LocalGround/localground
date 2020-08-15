# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0028_auto_20170620_0446'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='video',
            options={},
        ),
        migrations.RemoveField(
            model_name='video',
            name='attribution',
        ),
        migrations.RemoveField(
            model_name='video',
            name='content_type',
        ),
        migrations.RemoveField(
            model_name='video',
            name='extras',
        ),
        migrations.RemoveField(
            model_name='video',
            name='file_name_new',
        ),
        migrations.RemoveField(
            model_name='video',
            name='file_name_orig',
        ),
        migrations.RemoveField(
            model_name='video',
            name='host',
        ),
        migrations.RemoveField(
            model_name='video',
            name='virtual_path',
        ),
        migrations.AddField(
            model_name='video',
            name='provider',
            field=models.CharField(default='youtube', max_length=63, verbose_name='video provider', choices=[(b'vimeo', b'Vimeo'), (b'youtube', b'YouTube')]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='video',
            name='video_id',
            field=models.CharField(default='1', max_length=255),
            preserve_default=False,
        ),
    ]
