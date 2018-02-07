# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0040_auto_20171222_2010'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='marker',
            name='last_updated_by',
        ),
        migrations.RemoveField(
            model_name='marker',
            name='owner',
        ),
        migrations.RemoveField(
            model_name='marker',
            name='project',
        ),
        migrations.DeleteModel(
            name='Marker',
        ),
    ]
