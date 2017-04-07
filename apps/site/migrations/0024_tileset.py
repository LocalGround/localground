# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.postgres.fields
from django.conf import settings
import localground.apps.lib.helpers


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('site', '0023_auto_20170407_0233'),
    ]

    operations = [
        migrations.CreateModel(
            name='TileSet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('min_zoom', models.IntegerField(default=1)),
                ('max_zoom', models.IntegerField(default=20)),
                ('is_printable', models.BooleanField(default=False)),
                ('provider_id', models.CharField(max_length=30, blank=True)),
                ('tile_url', models.CharField(max_length=512, blank=True)),
                ('static_url', models.CharField(max_length=512, blank=True)),
                ('last_updated_by', models.ForeignKey(related_name='site_tileset_related', to=settings.AUTH_USER_MODEL)),
                ('overlay_source', models.ForeignKey(to='site.OverlaySource')),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('id',),
                'verbose_name': 'tile',
                'verbose_name_plural': 'tiles',
            },
        ),
    ]
