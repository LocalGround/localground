# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0005_auto_20151215_1846'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='print',
            name='sorted_field_ids',
        ),
    ]
