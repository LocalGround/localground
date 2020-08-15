# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0019_auto_20170123_2202'),
    ]

    operations = [
        migrations.AddField(
            model_name='styledmap',
            name='project',
            field=models.ForeignKey(on_delete=models.CASCADE, related_name='styledmap+', default=1, to='site.Project'),
            preserve_default=False,
        ),
    ]
