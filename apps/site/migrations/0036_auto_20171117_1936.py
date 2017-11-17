# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0035_auto_20171026_1829'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='errorcode',
            options={'verbose_name': 'error-code', 'verbose_name_plural': 'error-codes'},
        ),
        migrations.AlterModelOptions(
            name='imageopts',
            options={'verbose_name': 'map-image', 'verbose_name_plural': 'map-images'},
        ),
        migrations.AlterModelOptions(
            name='statuscode',
            options={'ordering': ('id',), 'verbose_name': 'status-code', 'verbose_name_plural': 'status-codes'},
        ),
        migrations.AlterModelOptions(
            name='uploadsource',
            options={'verbose_name': 'upload-source', 'verbose_name_plural': 'upload-sources'},
        ),
        migrations.AlterModelOptions(
            name='uploadtype',
            options={'verbose_name': 'upload-type', 'verbose_name_plural': 'upload-types'},
        ),
    ]
