# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0056_auto_20180330_0106'),
    ]

    operations = [
        migrations.AddField(
            model_name='layer',
            name='group_by',
            field=models.CharField(default='uniform', max_length=255),
            preserve_default=False,
        ),
    ]
