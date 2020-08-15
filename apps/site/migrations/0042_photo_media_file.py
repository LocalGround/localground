# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0041_auto_20171128_2009'),
    ]

    operations = [
        migrations.AddField(
            model_name='photo',
            name='media_file',
            field=models.FileField(null=True, upload_to=''),
        ),
    ]
