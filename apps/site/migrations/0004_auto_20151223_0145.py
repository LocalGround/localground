# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0003_marker_extras'),
    ]

    operations = [
        migrations.AlterField(
            model_name='datatype',
            name='name',
            field=models.CharField(max_length=255, editable=False),
        ),
        migrations.AlterField(
            model_name='datatype',
            name='sql',
            field=models.CharField(max_length=500, editable=False),
        ),
        migrations.AlterField(
            model_name='overlaytype',
            name='description',
            field=models.TextField(editable=False, blank=True),
        ),
        migrations.AlterField(
            model_name='overlaytype',
            name='name',
            field=models.CharField(max_length=255, editable=False, blank=True),
        ),
    ]
