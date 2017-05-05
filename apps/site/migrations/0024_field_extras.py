# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0023_auto_20170420_1658'),
    ]

    operations = [
        migrations.AddField(
            model_name='field',
            name='extras',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
    ]
