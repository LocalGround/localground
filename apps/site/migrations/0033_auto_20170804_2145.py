# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0032_auto_20170804_2129'),
    ]

    operations = [
        migrations.AlterField(
            model_name='icon',
            name='anchor_x',
            field=models.FloatField(help_text=b'Icon anchor point - x coordinate'),
        ),
        migrations.AlterField(
            model_name='icon',
            name='anchor_y',
            field=models.FloatField(help_text=b'Icon anchor point - y coordinate'),
        ),
        migrations.AlterField(
            model_name='icon',
            name='file_type',
            field=models.CharField(max_length=63, verbose_name=b'file type', choices=[(b'svg', b'svg'), (b'jpg', b'jpg'), (b'png', b'png')]),
        ),
    ]
