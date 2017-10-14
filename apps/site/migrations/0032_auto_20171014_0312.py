# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0031_auto_20171008_2106'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='form',
            name='projects',
        ),
        migrations.AddField(
            model_name='form',
            name='project',
            field=models.ForeignKey(related_name='form+', default=2, to='site.Project'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='audio',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='mapimage',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='photo',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='video',
            name='attribution',
            field=models.CharField(help_text=b'Person / group who created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True),
        ),
    ]
