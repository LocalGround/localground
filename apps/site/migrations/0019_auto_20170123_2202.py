# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0018_auto_20170123_2029'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='styledmap',
            name='access_authority',
        ),
        migrations.RemoveField(
            model_name='styledmap',
            name='access_key',
        ),
        migrations.RemoveField(
            model_name='styledmap',
            name='extents',
        ),
    ]
