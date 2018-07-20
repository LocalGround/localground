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
            field=jsonfield.fields.JSONField(default=[{b'strokeWeight': 1, b'strokeOpacity': 1, b'height': 25, b'shape': b'circle', b'fillOpacity': 1, b'strokeColor': b'#ffffff', b'title': b'All items', b'isShowing': True, b'rule': b'*', b'width': 25, b'fillColor': b'rgb(255, 255, 153)'}], null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='styledmap',
            name='panel_styles',
            field=jsonfield.fields.JSONField(default={b'display_legend': True, b'paragraph': {b'fw': b'regular', b'color': b'#666', b'backgroundColor': b'#f0f1f5', b'font': b'Lato', b'type': b'paragraph', b'size': b'12'}, b'subtitle': {b'fw': b'regular', b'color': b'#666', b'backgroundColor': b'#f7f7f7', b'font': b'Lato', b'type': b'subtitle', b'size': b'12'}, b'tags': {b'fw': b'regular', b'color': b'#3d3d3d', b'backgroundColor': b'#f7f7f7', b'font': b'Lato', b'type': b'tags', b'size': b'10'}, b'title': {b'fw': b'bold', b'color': b'#ffffff', b'backgroundColor': b'#4e70d4', b'font': b'Lato', b'type': b'title', b'size': b'15'}}),
        ),
        migrations.AlterField(
            model_name='styledmap',
            name='metadata',
            field=jsonfield.fields.JSONField(default={b'displayLegend': True, b'streetview': True, b'allowPanZoom': True, b'displayTitleCard': True, b'titleCardInfo': {b'header': None, b'description': None, b'photo_ids': []}, b'nextPrevButtons': False, b'accessLevel': 2}),
        ),
        migrations.RunPython(load_fixture),
        migrations.RunSQL(get_extra_sql())
    ]
