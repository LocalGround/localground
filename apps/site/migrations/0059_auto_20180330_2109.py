# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0058_auto_20180330_1859'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='record',
            name='description',
        ),
        migrations.RemoveField(
            model_name='record',
            name='name',
        ),
    ]
