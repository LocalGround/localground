# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import os

def get_extra_sql():
    from localground.apps.settings import APPS_ROOT
    sql_statements = open(os.path.join(APPS_ROOT, 'sql/custom.sql'), 'r').read()
    return sql_statements

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
        migrations.RunSQL(get_extra_sql()),
    ]
