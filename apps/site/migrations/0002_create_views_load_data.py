# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import os
from django.conf import settings
from sys import path
from django.core import serializers

fixture_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../fixtures'))
fixture_filename = 'database_initialization.json'

def load_fixture(apps, schema_editor):
    fixture_file = os.path.join(fixture_dir, fixture_filename)

    fixture = open(fixture_file, 'rb')
    objects = serializers.deserialize('json', fixture, ignorenonexistent=True)
    for obj in objects:
        obj.save()
    fixture.close()

def get_extra_sql():
    from localground.apps.settings import APPS_ROOT
    sql_statements = open(os.path.join(APPS_ROOT, 'sql/custom.sql'), 'r').read()
    return sql_statements


class Migration(migrations.Migration):
    dependencies = [
        ('site', '0001_initial')
    ]
    operations = [
        migrations.RunSQL(get_extra_sql()),
        migrations.RunPython(load_fixture)
    ]
