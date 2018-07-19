# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields


def get_extra_sql():
    import os
    from localground.apps.settings import APPS_ROOT
    sql_statements = open(
        os.path.join(APPS_ROOT, 'sql/custom.sql'), 'r').read()
    return sql_statements


def load_fixture(apps, schema_editor):
    from django.core import serializers
    import os
    fixture_dir = os.path.abspath(
        os.path.join(os.path.dirname(__file__), '../../fixtures'))
    fixture_filename = 'database_initialization.json'
    fixture_file = os.path.join(fixture_dir, fixture_filename)
    fixture = open(fixture_file, 'rb')
    objects = serializers.deserialize('json', fixture, ignorenonexistent=True)
    for obj in objects:
        obj.save()
    fixture.close()


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0065_auto_20180719_0131'),
    ]

    operations = [
        migrations.AddField(
            model_name='styledmap',
            name='password',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='layer',
            name='symbols',
            field=jsonfield.fields.JSONField(default=[{b'strokeWeight': 1, b'strokeOpacity': 1, b'height': 25, b'shape': b'circle', b'fillOpacity': 1, b'strokeColor': b'#ffffff', b'title': b'All items', b'isShowing': True, b'rule': b'*', b'width': 25, b'fillColor': b'rgb(177, 89, 40)'}], null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='styledmap',
            name='metadata',
            field=jsonfield.fields.JSONField(default=b'{"title_card": {"enabled": true, "description": "Provide some text to introduce your map. You can include images.", "photo_ids": [], "title": "Title Card"}, "has_legend": true, "has_streetview": true, "access_level": 2, "has_zoom_pan_controls": true, "has_nav_controls": false}'),
        ),
        migrations.RunPython(load_fixture),
        migrations.RunSQL(get_extra_sql())
    ]
