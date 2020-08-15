# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0032_auto_20171014_0312'),
    ]

    operations = [
        migrations.AlterField(
            model_name='marker',
            name='project',
            field=models.ForeignKey(on_delete=models.CASCADE, related_name='marker+', to='site.Project'),
        ),
        migrations.AlterField(
            model_name='video',
            name='description',
            field=models.TextField(null=True, blank=True),
        ),
    ]
