# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0010_auto_20160113_2245'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='audio',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='form',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='layer',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='marker',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='photo',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='presentation',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='print',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='project',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='scan',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='snapshot',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='video',
            name='tags',
        ),
        migrations.RemoveField(
            model_name='wmsoverlay',
            name='tags',
        ),
    ]
