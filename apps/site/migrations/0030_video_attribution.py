# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0029_auto_20170714_1910'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='attribution',
            field=models.CharField(help_text=b'Name of the person / group who created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True),
        ),
    ]
