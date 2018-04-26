# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import django.contrib.postgres.fields
from django.conf import settings
import localground.apps.lib.helpers
import os


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('site', '0022_auto_20170125_0438'),
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
                ('tile_url', models.CharField(max_length=2000, blank=True)),
                ('static_url', models.CharField(max_length=2000, blank=True)),
                ('key', models.CharField(max_length=512, null=True, blank=True)),
                ('attribution', models.CharField(max_length=1000, null=True, blank=True)),
                ('extras', jsonfield.fields.JSONField(null=True, blank=True)),
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
        migrations.AlterUniqueTogether(
            name='snapshot',
            unique_together=set([]),
        ),
        migrations.RemoveField(
            model_name='snapshot',
            name='access_authority',
        ),
        migrations.RemoveField(
            model_name='snapshot',
            name='basemap',
        ),
        migrations.RemoveField(
            model_name='snapshot',
            name='last_updated_by',
        ),
        migrations.RemoveField(
            model_name='snapshot',
            name='owner',
        ),
        migrations.RemoveField(
            model_name='wmsoverlay',
            name='auth_groups',
        ),
        migrations.RemoveField(
            model_name='wmsoverlay',
            name='last_updated_by',
        ),
        migrations.RemoveField(
            model_name='wmsoverlay',
            name='overlay_source',
        ),
        migrations.RemoveField(
            model_name='wmsoverlay',
            name='overlay_type',
        ),
        migrations.RemoveField(
            model_name='wmsoverlay',
            name='owner',
        ),
        migrations.RemoveField(
            model_name='project',
            name='basemap',
        ),
        migrations.AlterField(
            model_name='marker',
            name='color',
            field=models.CharField(default=b'CCCCCC', max_length=6),
        ),
        migrations.DeleteModel(
            name='Snapshot',
        ),
        migrations.DeleteModel(
            name='WMSOverlay',
        ),
        migrations.AlterField(
            model_name='print',
            name='map_provider',
            field=models.ForeignKey(related_name='prints_print_tilesets', db_column=b'fk_provider', to='site.TileSet'),
        ),
        migrations.AlterField(
            model_name='styledmap',
            name='basemap',
            field=models.ForeignKey(default=1, to='site.TileSet'),
        )
    ]
