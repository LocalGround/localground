# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields.hstore


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0037_markerwithattributes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='markerwithattributes',
            name='color',
        ),
        migrations.AddField(
            model_name='markerwithattributes',
            name='form',
            field=models.ForeignKey(on_delete=models.CASCADE, default=1, to='site.Form'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='markerwithattributes',
            name='attributes',
            field=django.contrib.postgres.fields.hstore.HStoreField(default={}),
        ),
    ]
