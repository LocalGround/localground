# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0033_auto_20170804_2145'),
    ]

    operations = [
        migrations.AddField(
            model_name='icon',
            name='size',
            field=models.IntegerField(default=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='icon',
            name='anchor_x',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='icon',
            name='anchor_y',
            field=models.FloatField(),
        ),
    ]
