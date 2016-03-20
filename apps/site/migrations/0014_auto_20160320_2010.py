# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0013_merge'),
    ]

    operations = [
        migrations.RenameModel('ScanUser', 'MapImageUser'),
        migrations.RenameModel('Scan', 'MapImage')
    ]
