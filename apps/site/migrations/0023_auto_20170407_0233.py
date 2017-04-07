# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0022_auto_20170125_0438'),
    ]

    operations = [
        migrations.AlterField(
            model_name='marker',
            name='color',
            field=models.CharField(default=b'CCCCCC', max_length=6),
        ),
    ]
