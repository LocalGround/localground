# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0037_document'),
    ]

    operations = [
        migrations.AddField(
            model_name='audio',
            name='uploaded_file',
            field=models.FileField(null=True, upload_to=''),
        ),
    ]
