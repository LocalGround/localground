# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0053_auto_20180328_1937'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='field',
            name='is_display_field',
        ),
        migrations.RemoveField(
            model_name='layer',
            name='description',
        ),
        migrations.AlterField(
            model_name='layer',
            name='symbols',
            field=jsonfield.fields.JSONField(default=[b'{"strokeWeight": 1, "strokeOpacity": 1, "height": 20, "shape": "circle", "fillOpacity": 1, "strokeColor": "#ffffff", "title": "Untitled Layer", "isShowing": true, "rule": "*", "width": 20, "fillColor": "#4e70d4"}'], null=True, blank=True),
        ),
    ]
