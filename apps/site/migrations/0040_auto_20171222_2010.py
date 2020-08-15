# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import django.contrib.gis.db.models.fields
import django.contrib.postgres.fields
from django.conf import settings
import django.contrib.postgres.fields.hstore
import localground.apps.lib.helpers


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('site', '0039_merge'),
    ]

    operations = [
        migrations.CreateModel(
            name='Record',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
                ('extras', jsonfield.fields.JSONField(null=True, blank=True)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column='last_updated')),
                ('polyline', django.contrib.gis.db.models.fields.LineStringField(srid=4326, null=True, blank=True)),
                ('polygon', django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True)),
                ('attributes', django.contrib.postgres.fields.hstore.HStoreField(default={})),
                ('form', models.ForeignKey(on_delete=models.CASCADE, to='site.Form', null=True)),
                ('last_updated_by', models.ForeignKey(on_delete=models.CASCADE, related_name='site_record_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=models.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=models.CASCADE, related_name='record+', to='site.Project')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'record',
                'verbose_name_plural': 'records',
            },
        ),
        migrations.RemoveField(
            model_name='markerwithattributes',
            name='form',
        ),
        migrations.RemoveField(
            model_name='markerwithattributes',
            name='last_updated_by',
        ),
        migrations.RemoveField(
            model_name='markerwithattributes',
            name='owner',
        ),
        migrations.RemoveField(
            model_name='markerwithattributes',
            name='project',
        ),
        migrations.DeleteModel(
            name='MarkerWithAttributes',
        ),
    ]
