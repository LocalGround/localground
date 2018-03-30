# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0054_auto_20180329_2354'),
    ]

    operations = [
        migrations.AddField(
            model_name='layer',
            name='ordering',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='layer',
            name='symbols',
            field=jsonfield.fields.JSONField(default=[{b'strokeWeight': 1, b'strokeOpacity': 1, b'height': 20, b'shape': b'circle', b'fillOpacity': 1, b'strokeColor': b'#ffffff', b'title': b'Untitled Layer', b'isShowing': True, b'rule': b'*', b'width': 20, b'fillColor': b'#4e70d4'}], null=True, blank=True),
        ),
    ]
