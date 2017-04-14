# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
import django.contrib.gis.db.models.fields
import jsonfield.fields
import django.contrib.postgres.fields
from django.conf import settings
import localground.apps.lib.helpers
import os
from django.conf import settings
from sys import path
from django.core import serializers

fixture_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../fixtures'))
fixture_filename = 'database_initialization.json'

def get_extra_sql():
    from localground.apps.settings import APPS_ROOT
    sql_statements = open(os.path.join(APPS_ROOT, 'sql/custom.sql'), 'r').read()
    return sql_statements

def load_fixture(apps, schema_editor):
    fixture_file = os.path.join(fixture_dir, fixture_filename)

    fixture = open(fixture_file, 'rb')
    objects = serializers.deserialize('json', fixture, ignorenonexistent=True)
    for obj in objects:
        obj.save()
    fixture.close()

class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AudioUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_audio',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='FormUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_forms',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='MapImageUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_mapimages',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='MarkerUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_markers',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PhotoUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_photos',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PresentationUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_presentations',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PrintUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_prints',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ProjectUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_projects',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='StyledMapUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_maps',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='VideoUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_videos',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('extras', jsonfield.fields.JSONField(null=True, blank=True)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, verbose_name=b'caption', blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('file_name_new', models.CharField(max_length=255)),
                ('attribution', models.CharField(help_text=b'Name of the person who actually created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True)),
                ('last_updated_by', models.ForeignKey(related_name='site_audio_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'audio',
                'verbose_name_plural': 'audio',
            },
        ),
        migrations.CreateModel(
            name='DataType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, editable=False)),
                ('sql', models.CharField(max_length=500, editable=False)),
            ],
            options={
                'ordering': ['name'],
                'verbose_name': 'data-type',
                'verbose_name_plural': 'data-types',
            },
        ),
        migrations.CreateModel(
            name='ErrorCode',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=2000, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Field',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('col_name_db', models.CharField(max_length=255, db_column=b'col_name')),
                ('col_alias', models.CharField(max_length=255, verbose_name=b'column name')),
                ('is_display_field', models.BooleanField(default=False)),
                ('ordering', models.IntegerField()),
                ('data_type', models.ForeignKey(to='site.DataType')),
            ],
            options={
                'ordering': ['form__id', 'ordering'],
                'verbose_name': 'field',
                'verbose_name_plural': 'fields',
            },
        ),
        migrations.CreateModel(
            name='Form',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('access_key', models.CharField(max_length=16, null=True, blank=True)),
                ('slug', models.SlugField(help_text=b'A few words, separated by dashes "-", to be used as part of the url', max_length=100, verbose_name=b'Friendly URL')),
                ('table_name', models.CharField(unique=True, max_length=255)),
            ],
            options={
                'verbose_name': 'form',
                'verbose_name_plural': 'forms',
            },
        ),
        migrations.CreateModel(
            name='GenericAssociation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('ordering', models.IntegerField(default=1)),
                ('turned_on', models.BooleanField(default=False)),
                ('source_id', models.PositiveIntegerField()),
                ('entity_id', models.PositiveIntegerField()),
                ('entity_type', models.ForeignKey(related_name='site_genericassociation_related', to='contenttypes.ContentType')),
                ('last_updated_by', models.ForeignKey(related_name='site_genericassociation_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('source_type', models.ForeignKey(to='contenttypes.ContentType')),
            ],
        ),
        migrations.CreateModel(
            name='ImageOpts',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('extents', django.contrib.gis.db.models.fields.PolygonField(srid=4326)),
                ('northeast', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('southwest', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('center', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('zoom', models.IntegerField()),
                ('last_updated_by', models.ForeignKey(related_name='site_imageopts_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Layer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(null=True, blank=True)),
                ('data_source', models.TextField(null=True, blank=True)),
                ('symbol_shape', models.TextField(null=True, blank=True)),
                ('layer_type', models.CharField(default=b'basic', max_length=64, choices=[(b'categorical', b'Category'), (b'continuous', b'Continuous'), (b'basic', b'Basic'), (b'individual', b'Individual Sites')])),
                ('filters', jsonfield.fields.JSONField(null=True, blank=True)),
                ('symbols', jsonfield.fields.JSONField(null=True, blank=True)),
                ('last_updated_by', models.ForeignKey(related_name='site_layer_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Layout',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('display_name', models.CharField(max_length=255, blank=True)),
                ('map_width_pixels', models.IntegerField()),
                ('map_height_pixels', models.IntegerField()),
                ('qr_size_pixels', models.IntegerField()),
                ('border_width', models.IntegerField()),
                ('is_active', models.BooleanField(default=True)),
                ('is_landscape', models.BooleanField(default=False)),
                ('is_data_entry', models.BooleanField(default=True)),
                ('is_mini_form', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ('id',),
            },
        ),
        migrations.CreateModel(
            name='MapImage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, verbose_name=b'caption', blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('file_name_new', models.CharField(max_length=255)),
                ('attribution', models.CharField(help_text=b'Name of the person who actually created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True)),
                ('uuid', models.CharField(unique=True, max_length=8)),
                ('file_name_thumb', models.CharField(max_length=255, null=True, blank=True)),
                ('file_name_scaled', models.CharField(max_length=255, null=True, blank=True)),
                ('scale_factor', models.FloatField(null=True, blank=True)),
                ('email_sender', models.CharField(max_length=255, null=True, blank=True)),
                ('email_subject', models.CharField(max_length=500, null=True, blank=True)),
                ('email_body', models.TextField(null=True, blank=True)),
                ('qr_rect', models.CharField(max_length=255, null=True, blank=True)),
                ('qr_code', models.CharField(max_length=8, null=True, blank=True)),
                ('map_rect', models.CharField(max_length=255, null=True, blank=True)),
                ('last_updated_by', models.ForeignKey(related_name='site_mapimage_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('processed_image', models.ForeignKey(blank=True, to='site.ImageOpts', null=True)),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'map-image',
                'verbose_name_plural': 'map-images',
            },
        ),
        migrations.CreateModel(
            name='Marker',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('extras', jsonfield.fields.JSONField(null=True, blank=True)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
                ('polyline', django.contrib.gis.db.models.fields.LineStringField(srid=4326, null=True, blank=True)),
                ('polygon', django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True)),
                ('color', models.CharField(default=b'CCCCCC', max_length=6)),
                ('last_updated_by', models.ForeignKey(related_name='site_marker_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'marker',
                'verbose_name_plural': 'markers',
            },
        ),
        migrations.CreateModel(
            name='ObjectAuthority',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('description', models.CharField(max_length=1000, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='OverlaySource',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
            ],
            options={
                'verbose_name': 'overlay-source',
                'verbose_name_plural': 'overlay-sources',
            },
        ),
        migrations.CreateModel(
            name='OverlayType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, editable=False, blank=True)),
                ('description', models.TextField(editable=False, blank=True)),
            ],
            options={
                'verbose_name': 'overlay-type',
                'verbose_name_plural': 'overlay-types',
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('extras', jsonfield.fields.JSONField(null=True, blank=True)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, verbose_name=b'caption', blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('file_name_new', models.CharField(max_length=255)),
                ('attribution', models.CharField(help_text=b'Name of the person who actually created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True)),
                ('file_name_large', models.CharField(max_length=255)),
                ('file_name_medium', models.CharField(max_length=255)),
                ('file_name_medium_sm', models.CharField(max_length=255)),
                ('file_name_small', models.CharField(max_length=255)),
                ('file_name_marker_lg', models.CharField(max_length=255)),
                ('file_name_marker_sm', models.CharField(max_length=255)),
                ('device', models.CharField(max_length=255, null=True, blank=True)),
                ('last_updated_by', models.ForeignKey(related_name='site_photo_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'photo',
                'verbose_name_plural': 'photos',
            },
        ),
        migrations.CreateModel(
            name='Presentation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('access_key', models.CharField(max_length=16, null=True, blank=True)),
                ('code', jsonfield.fields.JSONField(null=True, blank=True)),
                ('slug', models.SlugField(help_text=b'A few words, separated by dashes "-", to be used as part of the url', max_length=100, verbose_name=b'Friendly URL')),
                ('access_authority', models.ForeignKey(db_column=b'view_authority', verbose_name=b'Sharing', to='site.ObjectAuthority')),
                ('last_updated_by', models.ForeignKey(related_name='site_presentation_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Print',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('extents', django.contrib.gis.db.models.fields.PolygonField(srid=4326)),
                ('northeast', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('southwest', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('center', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('zoom', models.IntegerField()),
                ('uuid', models.CharField(unique=True, max_length=8)),
                ('name', models.CharField(max_length=255, verbose_name=b'Map Title', blank=True)),
                ('description', models.TextField(null=True, verbose_name=b'Instructions', blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('map_width', models.IntegerField()),
                ('map_height', models.IntegerField()),
                ('map_image_path', models.CharField(max_length=255)),
                ('pdf_path', models.CharField(max_length=255)),
                ('preview_image_path', models.CharField(max_length=255)),
                ('deleted', models.BooleanField(default=False)),
                ('last_updated_by', models.ForeignKey(related_name='site_print_related', to=settings.AUTH_USER_MODEL)),
                ('layout', models.ForeignKey(to='site.Layout')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'print',
                'verbose_name_plural': 'prints',
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('access_key', models.CharField(max_length=16, null=True, blank=True)),
                ('extents', django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True)),
                ('slug', models.SlugField(help_text=b'A few words, separated by dashes "-", to be used as part of the url', max_length=100, verbose_name=b'Friendly URL')),
                ('access_authority', models.ForeignKey(db_column=b'view_authority', verbose_name=b'Sharing', to='site.ObjectAuthority')),
                ('last_updated_by', models.ForeignKey(related_name='site_project_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
                'verbose_name': 'project',
                'verbose_name_plural': 'projects',
            },
        ),
        migrations.CreateModel(
            name='StatusCode',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=2000, null=True, blank=True)),
            ],
            options={
                'ordering': ('id',),
            },
        ),
        migrations.CreateModel(
            name='StyledMap',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('center', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('zoom', models.IntegerField()),
                ('panel_styles', jsonfield.fields.JSONField(null=True, blank=True)),
                ('slug', models.SlugField(help_text=b'A few words, separated by dashes "-", to be used as part of the url', max_length=100, verbose_name=b'Friendly URL')),
            ],
            options={
                'verbose_name': 'styled_map',
                'verbose_name_plural': 'styled_maps',
            },
        ),
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
        migrations.CreateModel(
            name='UploadSource',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='UploadType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='UserAuthority',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserAuthorityObject',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('time_stamp', models.DateTimeField(default=datetime.datetime.now)),
                ('object_id', models.PositiveIntegerField()),
                ('authority', models.ForeignKey(to='site.UserAuthority')),
                ('content_type', models.ForeignKey(to='contenttypes.ContentType')),
                ('granted_by', models.ForeignKey(related_name='site_userauthorityobject_related', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email_announcements', models.BooleanField(default=True)),
                ('default_location', django.contrib.gis.db.models.fields.PointField(help_text=b'Search map by address, or drag the marker to your home location', srid=4326, null=True, blank=True)),
                ('date_created', models.DateTimeField(default=datetime.datetime.now)),
                ('time_stamp', models.DateTimeField(default=datetime.datetime.now, db_column=b'last_updated')),
                ('contacts', models.ManyToManyField(related_name='site_userprofile_related', verbose_name=b"Users You're Following", to=settings.AUTH_USER_MODEL, blank=True)),
                ('default_view_authority', models.ForeignKey(default=1, verbose_name=b'Share Preference', to='site.ObjectAuthority', help_text=b'Your default sharing settings for your maps and media')),
                ('user', models.OneToOneField(related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('extras', jsonfield.fields.JSONField(null=True, blank=True)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, verbose_name=b'caption', blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('file_name_new', models.CharField(max_length=255)),
                ('attribution', models.CharField(help_text=b'Name of the person who actually created the media file (text)', max_length=500, null=True, verbose_name=b'Author / Creator', blank=True)),
                ('last_updated_by', models.ForeignKey(related_name='site_video_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(related_name='video+', to='site.Project')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'video',
                'verbose_name_plural': 'videos',
            },
        ),
        migrations.AddField(
            model_name='styledmap',
            name='basemap',
            field=models.ForeignKey(default=1, to='site.TileSet'),
        ),
        migrations.AddField(
            model_name='styledmap',
            name='last_updated_by',
            field=models.ForeignKey(related_name='site_styledmap_related', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='styledmap',
            name='owner',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='styledmap',
            name='project',
            field=models.ForeignKey(related_name='styledmap+', to='site.Project'),
        ),
        migrations.AddField(
            model_name='print',
            name='map_provider',
            field=models.ForeignKey(related_name='prints_print_tilesets', db_column=b'fk_provider', to='site.TileSet'),
        ),
        migrations.AddField(
            model_name='print',
            name='owner',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='print',
            name='project',
            field=models.ForeignKey(related_name='print+', to='site.Project'),
        ),
        migrations.AddField(
            model_name='photo',
            name='project',
            field=models.ForeignKey(related_name='photo+', to='site.Project'),
        ),
        migrations.AddField(
            model_name='marker',
            name='project',
            field=models.ForeignKey(to='site.Project'),
        ),
        migrations.AddField(
            model_name='mapimage',
            name='project',
            field=models.ForeignKey(related_name='mapimage+', to='site.Project'),
        ),
        migrations.AddField(
            model_name='mapimage',
            name='source_print',
            field=models.ForeignKey(blank=True, to='site.Print', null=True),
        ),
        migrations.AddField(
            model_name='mapimage',
            name='status',
            field=models.ForeignKey(default=1, to='site.StatusCode'),
        ),
        migrations.AddField(
            model_name='mapimage',
            name='upload_source',
            field=models.ForeignKey(default=1, to='site.UploadSource'),
        ),
        migrations.AddField(
            model_name='layer',
            name='styled_map',
            field=models.ForeignKey(related_name='layer+', to='site.StyledMap'),
        ),
        migrations.AddField(
            model_name='imageopts',
            name='source_mapimage',
            field=models.ForeignKey(to='site.MapImage'),
        ),
        migrations.AddField(
            model_name='form',
            name='access_authority',
            field=models.ForeignKey(db_column=b'view_authority', verbose_name=b'Sharing', to='site.ObjectAuthority'),
        ),
        migrations.AddField(
            model_name='form',
            name='last_updated_by',
            field=models.ForeignKey(related_name='site_form_related', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='form',
            name='owner',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='form',
            name='projects',
            field=models.ManyToManyField(to='site.Project'),
        ),
        migrations.AddField(
            model_name='field',
            name='form',
            field=models.ForeignKey(to='site.Form'),
        ),
        migrations.AddField(
            model_name='field',
            name='last_updated_by',
            field=models.ForeignKey(related_name='site_field_related', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='field',
            name='owner',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='audio',
            name='project',
            field=models.ForeignKey(related_name='audio+', to='site.Project'),
        ),
        migrations.AlterUniqueTogether(
            name='styledmap',
            unique_together=set([('slug', 'owner')]),
        ),
        migrations.AlterUniqueTogether(
            name='project',
            unique_together=set([('slug', 'owner')]),
        ),
        migrations.AlterUniqueTogether(
            name='layer',
            unique_together=set([('title', 'styled_map')]),
        ),
        migrations.AlterUniqueTogether(
            name='genericassociation',
            unique_together=set([('source_type', 'source_id', 'entity_type', 'entity_id')]),
        ),
        migrations.AlterUniqueTogether(
            name='form',
            unique_together=set([('slug', 'owner')]),
        ),
        migrations.AlterUniqueTogether(
            name='field',
            unique_together=set([('col_alias', 'form'), ('col_name_db', 'form')]),
        ),
        migrations.RunPython(load_fixture),
        migrations.RunSQL(get_extra_sql()),
    ]
