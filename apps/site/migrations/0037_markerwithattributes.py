# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import django.contrib.gis.db.models.fields
import django.contrib.postgres.fields
from django.conf import settings
import django.contrib.postgres.fields.hstore
import localground.apps.lib.helpers
from django.contrib.postgres.fields import HStoreField
from django.contrib.postgres.operations import HStoreExtension



class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('site', '0036_auto_20171120_2314'),
    ]

    operations = [
        HStoreExtension(),
        migrations.CreateModel(
            name='MarkerWithAttributes',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
                ('extras', jsonfield.fields.JSONField(null=True, blank=True)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('polyline', django.contrib.gis.db.models.fields.LineStringField(srid=4326, null=True, blank=True)),
                ('polygon', django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True)),
                ('color', models.CharField(default=b'CCCCCC', max_length=6)),
                ('attributes', django.contrib.postgres.fields.hstore.HStoreField()),
                ('last_updated_by', models.ForeignKey(related_name='site_markerwithattributes_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(related_name='markerwithattributes+', to='site.Project')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'marker',
                'verbose_name_plural': 'markers',
            },
        ),
    ]
