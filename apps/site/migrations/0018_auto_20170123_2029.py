# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import django.contrib.gis.db.models.fields
import django.contrib.postgres.fields
from django.conf import settings
import localground.apps.lib.helpers


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('site', '0017_auto_20160320_2124'),
    ]

    operations = [
        migrations.CreateModel(
            name='StyledMap',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column='last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('access_key', models.CharField(max_length=16, null=True, blank=True)),
                ('extents', django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True)),
                ('slug', models.SlugField(help_text='A few words, separated by dashes "-", to be used as part of the url', max_length=100, verbose_name='Friendly URL')),
                ('center', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('zoom', models.IntegerField()),
                ('panel_styles', jsonfield.fields.JSONField(null=True, blank=True)),
                ('access_authority', models.ForeignKey(on_delete=models.CASCADE, db_column='view_authority', verbose_name='Sharing', to='site.ObjectAuthority')),
                ('basemap', models.ForeignKey(on_delete=models.PROTECT, default=12, to='site.WMSOverlay')),
                ('last_updated_by', models.ForeignKey(on_delete=models.CASCADE, related_name='site_styledmap_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=models.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'styled_map',
                'verbose_name_plural': 'styled_maps',
            },
        ),
        migrations.AlterField(
            model_name='audio',
            name='description',
            field=models.TextField(null=True, verbose_name='caption', blank=True),
        ),
        migrations.AlterField(
            model_name='mapimage',
            name='description',
            field=models.TextField(null=True, verbose_name='caption', blank=True),
        ),
        migrations.AlterField(
            model_name='photo',
            name='description',
            field=models.TextField(null=True, verbose_name='caption', blank=True),
        ),
        migrations.AlterField(
            model_name='video',
            name='description',
            field=models.TextField(null=True, verbose_name='caption', blank=True),
        ),
        migrations.AlterUniqueTogether(
            name='styledmap',
            unique_together=set([('slug', 'owner')]),
        ),
    ]
