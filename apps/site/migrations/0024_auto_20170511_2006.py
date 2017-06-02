# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0023_auto_20170420_1658'),
    ]

    operations = [
        migrations.RenameField(
            model_name='layer',
            old_name='filters',
            new_name='metadata',
        ),
        migrations.RemoveField(
            model_name='layer',
            name='symbol_shape',
        ),
    ]
