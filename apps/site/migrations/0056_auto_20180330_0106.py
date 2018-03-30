# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0055_auto_20180330_0028'),
    ]

    operations = [
        migrations.AlterField(
            model_name='layer',
            name='symbols',
            field=jsonfield.fields.JSONField(default=[{b'strokeWeight': 1, b'strokeOpacity': 1, b'height': 20, b'shape': b'circle', b'fillOpacity': 1, b'strokeColor': b'#ffffff', b'title': b'Untitled Symbol', b'isShowing': True, b'rule': b'*', b'width': 20, b'fillColor': b'#4e70d4'}], null=True, blank=True),
        ),
        migrations.AlterUniqueTogether(
            name='layer',
            unique_together=set([]),
        ),
    ]
