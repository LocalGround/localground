# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0066_auto_20180719_1518'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='genericassociation',
            name='turned_on',
        )
    ]
