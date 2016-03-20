# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0015_auto_20160320_2013'),
    ]

    operations = [
        migrations.RenameField(
            model_name='imageopts',
            old_name='source_scan',
            new_name='source_mapimage',
        ),
        migrations.AlterModelTable(
            name='mapimageuser',
            table='v_private_mapimages',
        ),
    ]
