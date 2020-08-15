# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0051_auto_20180313_0004'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='layer',
            name='data_source',
        ),
        migrations.RemoveField(
            model_name='layer',
            name='group_by',
        ),
        migrations.AddField(
            model_name='layer',
            name='dataset',
            field=models.ForeignKey(on_delete=models.CASCADE, related_name='layer+', default=1, to='site.Form'),
            preserve_default=False,
        ),
    ]
