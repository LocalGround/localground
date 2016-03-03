# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0011_auto_20160114_0403'),
    ]

    operations = [
        migrations.RenameField(
            model_name='audio',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='form',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='layer',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='marker',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='photo',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='presentation',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='print',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='project',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='scan',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='snapshot',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='video',
            new_name='tags',
            old_name='newtags'),
        migrations.RenameField(
            model_name='wmsoverlay',
            new_name='tags',
            old_name='newtags'),
    ]
