# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0008_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='audio',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='form',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='layer',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='marker',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='photo',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='presentation',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='print',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='project',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='scan',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='snapshot',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='video',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
        migrations.AddField(
            model_name='wmsoverlay',
            name='newtags',
            field=django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None),
        ),
    ]
