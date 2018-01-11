# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0034_auto_20171014_0500'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='form',
            name='access_authority',
        ),
        migrations.RemoveField(
            model_name='form',
            name='access_key',
        ),
    ]
