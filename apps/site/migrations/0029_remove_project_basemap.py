# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0028_auto_20170413_1926'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='basemap',
        ),
    ]
