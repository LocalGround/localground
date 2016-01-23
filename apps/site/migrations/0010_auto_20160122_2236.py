# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0009_auto_20160122_2230'),
    ]

    operations = [
        migrations.AddField(
            model_name='audio',
            name='extras',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='photo',
            name='extras',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='video',
            name='extras',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
    ]
