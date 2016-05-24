# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models, migrations
from django.conf import settings
import os

def get_extra_sql():
    from localground.apps.settings import APPS_ROOT
    sql_statements = open(os.path.join(APPS_ROOT, 'sql/custom.sql'), 'r').read()
    return sql_statements

class Migration(migrations.Migration):

    dependencies = [
        ('site', '0013_merge'),
    ]

    operations = [
        migrations.RenameModel('ScanUser', 'MapImageUser'),
        migrations.RenameModel('Scan', 'MapImage'),
        migrations.AlterModelOptions(
            name='statuscode',
            options={'ordering': ('id',)},
        ),
        migrations.AlterField(
            model_name='mapimage',
            name='last_updated_by',
            field=models.ForeignKey(related_name='site_mapimage_related', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='mapimage',
            name='project',
            field=models.ForeignKey(related_name='mapimage+', to='site.Project'),
        ),
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
