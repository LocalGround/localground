# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0004_auto_20151210_2343'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='print',
            name='form',
        ),
        migrations.RemoveField(
            model_name='print',
            name='form_column_widths',
        ),
    ]
