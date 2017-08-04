# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0031_icon'),
    ]

    operations = [
        migrations.RenameField(
            model_name='icon',
            old_name='x_position',
            new_name='anchor_x',
        ),
        migrations.RenameField(
            model_name='icon',
            old_name='y_position',
            new_name='anchor_y',
        ),
    ]
