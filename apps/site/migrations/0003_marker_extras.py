# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0002_create_views_load_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='marker',
            name='extras',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
    ]
