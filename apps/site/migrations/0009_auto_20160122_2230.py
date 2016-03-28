# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0008_merge'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audio',
            name='attribution',
            field=models.CharField(help_text=b'Name of the person who actually created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True),
        ),
        migrations.AlterField(
            model_name='photo',
            name='attribution',
            field=models.CharField(help_text=b'Name of the person who actually created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True),
        ),
        migrations.AlterField(
            model_name='scan',
            name='attribution',
            field=models.CharField(help_text=b'Name of the person who actually created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True),
        ),
        migrations.AlterField(
            model_name='scan',
            name='status',
            field=models.ForeignKey(default=1, to='site.StatusCode'),
        ),
        migrations.AlterField(
            model_name='scan',
            name='upload_source',
            field=models.ForeignKey(default=1, to='site.UploadSource'),
        ),
        migrations.AlterField(
            model_name='video',
            name='attribution',
            field=models.CharField(help_text=b'Name of the person who actually created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True),
        ),
    ]
