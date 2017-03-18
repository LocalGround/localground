# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0021_auto_20170124_0033'),
    ]

    operations = [
        migrations.RenameField(
            model_name='layer',
            old_name='data_property',
            new_name='data_source',
        ),
    ]
