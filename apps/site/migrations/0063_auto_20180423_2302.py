# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0061_auto_20180423_2223'),
    ]

    operations = [
        migrations.AlterField(
            model_name='layer',
            name='symbols',
            field=jsonfield.fields.JSONField(default=[{b'strokeWeight': 1, b'strokeOpacity': 1, b'height': 25, b'shape': b'circle', b'fillOpacity': 1, b'strokeColor': b'#ffffff', b'title': b'Untitled Symbol', b'isShowing': True, b'rule': b'*', b'width': 25, b'fillColor': b'rgb(51, 160, 44)'}], null=True, blank=True),
        ),
        migrations.DeleteModel(
            name='Form',
        )
    ]
