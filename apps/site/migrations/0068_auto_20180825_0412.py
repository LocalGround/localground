# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0067_auto_20180801_0154'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='project',
            unique_together=set([]),
        ),
    ]
