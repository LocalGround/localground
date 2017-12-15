# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0033_auto_20171014_0454'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='form',
            unique_together=set([]),
        ),
        migrations.RemoveField(
            model_name='form',
            name='slug',
        ),
    ]
