# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0057_layer_group_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='layer',
            name='group_by',
            field=models.CharField(default=b'uniform', max_length=255),
        ),
    ]
