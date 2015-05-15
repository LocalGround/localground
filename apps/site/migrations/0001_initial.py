# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
import django.contrib.gis.db.models.fields
import jsonfield.fields
from django.conf import settings
import tagging_autocomplete.models
import localground.apps.lib.helpers
import os
import pdb
from sys import path
from django.core import serializers


def load_fixture(apps, schema_editor):
    fixture_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../fixtures'))
    fixture_filename = 'l.json'

    fixture_file = os.path.join(fixture_dir, fixture_filename)

    fixture = open(fixture_file, 'rb')
    objects = serializers.deserialize('json', fixture, ignorenonexistent=True)
    for obj in objects:
        obj.save()
    fixture.close()


def load_sql():
    from localground.apps.settings import APPS_ROOT

    sql_statements = open(os.path.join(APPS_ROOT, 'sql/custom.sql'), 'r').read()
    pdb.set_trace()
    return sql_statements


class Migration(migrations.Migration):
    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('auth', '0006_require_contenttypes_0002'),
        ('tagging', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AttachmentUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_attachments',
                'managed': False,
            },
        ),
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
            name='LayerUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_layers',
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
            name='ScanUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_scans',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='SnapshotUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'db_table': 'v_private_views',
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
            name='Attachment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('file_name_new', models.CharField(max_length=255)),
                ('attribution',
                 models.CharField(max_length=500, null=True, verbose_name=b'Author / Creator', blank=True)),
                ('uuid', models.CharField(unique=True, max_length=8)),
                ('file_name_thumb', models.CharField(max_length=255, null=True, blank=True)),
                ('file_name_scaled', models.CharField(max_length=255, null=True, blank=True)),
                ('scale_factor', models.FloatField(null=True, blank=True)),
                ('email_sender', models.CharField(max_length=255, null=True, blank=True)),
                ('email_subject', models.CharField(max_length=500, null=True, blank=True)),
                ('email_body', models.TextField(null=True, blank=True)),
                ('qr_rect', models.CharField(max_length=255, null=True, blank=True)),
                ('qr_code', models.CharField(max_length=8, null=True, blank=True)),
                ('is_short_form', models.BooleanField(default=False)),
                ('last_updated_by',
                 models.ForeignKey(related_name='site_attachment_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'attachment',
                'verbose_name_plural': 'attachments',
            },
        ),
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('file_name_new', models.CharField(max_length=255)),
                ('attribution',
                 models.CharField(max_length=500, null=True, verbose_name=b'Author / Creator', blank=True)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
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
                ('name', models.CharField(max_length=255)),
                ('sql', models.CharField(max_length=500)),
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
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('col_name_db', models.CharField(max_length=255, db_column=b'col_name')),
                ('col_alias', models.CharField(max_length=255, verbose_name=b'column name')),
                ('display_width', models.IntegerField()),
                ('is_display_field', models.BooleanField(default=False)),
                ('is_printable', models.BooleanField(default=True)),
                ('has_snippet_field', models.BooleanField(default=True)),
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
            name='FieldLayout',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('width', models.IntegerField()),
                ('ordering', models.IntegerField()),
                ('field', models.ForeignKey(to='site.Field')),
                ('last_updated_by',
                 models.ForeignKey(related_name='site_fieldlayout_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['map_print__id', 'ordering'],
                'verbose_name': 'field-layout',
                'verbose_name_plural': 'field-layouts',
            },
        ),
        migrations.CreateModel(
            name='Form',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('access_key', models.CharField(max_length=16, null=True, blank=True)),
                ('slug',
                 models.SlugField(help_text=b'A few words, separated by dashes "-", to be used as part of the url',
                                  max_length=100, verbose_name=b'Friendly URL')),
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
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('ordering', models.IntegerField(default=1)),
                ('turned_on', models.BooleanField(default=False)),
                ('source_id', models.PositiveIntegerField()),
                ('entity_id', models.PositiveIntegerField()),
                ('entity_type',
                 models.ForeignKey(related_name='site_genericassociation_related', to='contenttypes.ContentType')),
                ('last_updated_by',
                 models.ForeignKey(related_name='site_genericassociation_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('source_type', models.ForeignKey(to='contenttypes.ContentType')),
            ],
        ),
        migrations.CreateModel(
            name='ImageOpts',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('extents', django.contrib.gis.db.models.fields.PolygonField(srid=4326)),
                ('northeast', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('southwest', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('center', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('zoom', models.IntegerField()),
                ('last_updated_by',
                 models.ForeignKey(related_name='site_imageopts_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Layer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('access_key', models.CharField(max_length=16, null=True, blank=True)),
                ('slug',
                 models.SlugField(help_text=b'A few words, separated by dashes "-", to be used as part of the url',
                                  max_length=100, verbose_name=b'Friendly URL')),
                ('symbols', jsonfield.fields.JSONField(null=True, blank=True)),
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
            name='Marker',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
                ('polyline', django.contrib.gis.db.models.fields.LineStringField(srid=4326, null=True, blank=True)),
                ('polygon', django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True)),
                ('color', models.CharField(max_length=6)),
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
                ('name', models.CharField(max_length=255, blank=True)),
                ('description', models.TextField(blank=True)),
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
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('file_name_new', models.CharField(max_length=255)),
                ('attribution',
                 models.CharField(max_length=500, null=True, verbose_name=b'Author / Creator', blank=True)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
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
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('access_key', models.CharField(max_length=16, null=True, blank=True)),
                ('code', jsonfield.fields.JSONField(null=True, blank=True)),
                ('slug',
                 models.SlugField(help_text=b'A few words, separated by dashes "-", to be used as part of the url',
                                  max_length=100, verbose_name=b'Friendly URL')),
                ('access_authority',
                 models.ForeignKey(db_column=b'view_authority', verbose_name=b'Sharing', to='site.ObjectAuthority')),
                ('last_updated_by',
                 models.ForeignKey(related_name='site_presentation_related', to=settings.AUTH_USER_MODEL)),
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
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
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
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('map_width', models.IntegerField()),
                ('map_height', models.IntegerField()),
                ('map_image_path', models.CharField(max_length=255)),
                ('pdf_path', models.CharField(max_length=255)),
                ('preview_image_path', models.CharField(max_length=255)),
                ('form_column_widths', models.CharField(max_length=200, null=True, blank=True)),
                ('sorted_field_ids',
                 models.CharField(max_length=100, null=True, db_column=b'form_column_ids', blank=True)),
                ('deleted', models.BooleanField(default=False)),
                ('form', models.ForeignKey(blank=True, to='site.Form', null=True)),
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
            name='ProcessingStatusCode',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=2000, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('access_key', models.CharField(max_length=16, null=True, blank=True)),
                ('extents', django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True)),
                ('slug',
                 models.SlugField(help_text=b'A few words, separated by dashes "-", to be used as part of the url',
                                  max_length=100, verbose_name=b'Friendly URL')),
                ('access_authority',
                 models.ForeignKey(db_column=b'view_authority', verbose_name=b'Sharing', to='site.ObjectAuthority')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'project',
                'verbose_name_plural': 'projects',
            },
        ),
        migrations.CreateModel(
            name='Scan',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('file_name_new', models.CharField(max_length=255)),
                ('attribution',
                 models.CharField(max_length=500, null=True, verbose_name=b'Author / Creator', blank=True)),
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
                ('last_updated_by', models.ForeignKey(related_name='site_scan_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('processed_image', models.ForeignKey(blank=True, to='site.ImageOpts', null=True)),
                ('project', models.ForeignKey(related_name='scan+', to='site.Project')),
                ('source_print', models.ForeignKey(blank=True, to='site.Print', null=True)),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'map-image',
                'verbose_name_plural': 'map-images',
            },
        ),
        migrations.CreateModel(
            name='Snapshot',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('access_key', models.CharField(max_length=16, null=True, blank=True)),
                ('extents', django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True)),
                ('slug',
                 models.SlugField(help_text=b'A few words, separated by dashes "-", to be used as part of the url',
                                  max_length=100, verbose_name=b'Friendly URL')),
                ('center', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('zoom', models.IntegerField()),
                ('access_authority',
                 models.ForeignKey(db_column=b'view_authority', verbose_name=b'Sharing', to='site.ObjectAuthority')),
            ],
            options={
                'abstract': False,
                'verbose_name': 'snapshot',
                'verbose_name_plural': 'snapshots',
            },
        ),
        migrations.CreateModel(
            name='Snippet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
                ('shape_string_json', models.CharField(max_length=512, blank=True)),
                ('is_blank', models.BooleanField(default=False)),
                (
                'last_updated_by', models.ForeignKey(related_name='site_snippet_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('source_attachment', models.ForeignKey(to='site.Attachment')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'snippet',
                'verbose_name_plural': 'snippets',
            },
        ),
        migrations.CreateModel(
            name='StatusCode',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=2000, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='UploadSource',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='UploadSrc',
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
                ('granted_by',
                 models.ForeignKey(related_name='site_userauthorityobject_related', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email_announcements', models.BooleanField(default=True)),
                ('default_location', django.contrib.gis.db.models.fields.PointField(
                    help_text=b'Search map by address, or drag the marker to your home location', srid=4326, null=True,
                    blank=True)),
                ('date_created', models.DateTimeField(default=datetime.datetime.now)),
                ('time_stamp', models.DateTimeField(default=datetime.datetime.now, db_column=b'last_updated')),
                ('contacts',
                 models.ManyToManyField(related_name='site_userprofile_related', verbose_name=b"Users You're Following",
                                        to=settings.AUTH_USER_MODEL, blank=True)),
                ('default_view_authority',
                 models.ForeignKey(default=1, verbose_name=b'Share Preference', to='site.ObjectAuthority',
                                   help_text=b'Your default sharing settings for your maps and media')),
                ('user', models.OneToOneField(related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('content_type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('file_name_new', models.CharField(max_length=255)),
                ('attribution',
                 models.CharField(max_length=500, null=True, verbose_name=b'Author / Creator', blank=True)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326, null=True, blank=True)),
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
        migrations.CreateModel(
            name='WMSOverlay',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created',
                 models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds,
                                                    db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', tagging_autocomplete.models.TagAutocompleteField(max_length=255, null=True, blank=True)),
                ('wms_url', models.CharField(max_length=500, blank=True)),
                ('min_zoom', models.IntegerField(default=1)),
                ('max_zoom', models.IntegerField(default=20)),
                ('extents', django.contrib.gis.db.models.fields.PolygonField(srid=4326, null=True, blank=True)),
                ('is_printable', models.BooleanField(default=False)),
                ('provider_id', models.CharField(max_length=30, blank=True)),
                ('auth_groups', models.ManyToManyField(to='auth.Group', blank=True)),
                ('last_updated_by',
                 models.ForeignKey(related_name='site_wmsoverlay_related', to=settings.AUTH_USER_MODEL)),
                ('overlay_source', models.ForeignKey(to='site.OverlaySource')),
                ('overlay_type', models.ForeignKey(to='site.OverlayType')),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('id',),
                'verbose_name': 'tile',
                'verbose_name_plural': 'tiles',
            },
        ),
        migrations.AddField(
            model_name='snapshot',
            name='basemap',
            field=models.ForeignKey(default=12, to='site.WMSOverlay'),
        ),
        migrations.AddField(
            model_name='snapshot',
            name='last_updated_by',
            field=models.ForeignKey(related_name='site_snapshot_related', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='snapshot',
            name='owner',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='scan',
            name='status',
            field=models.ForeignKey(to='site.StatusCode'),
        ),
        migrations.AddField(
            model_name='scan',
            name='upload_source',
            field=models.ForeignKey(to='site.UploadSource'),
        ),
        migrations.AddField(
            model_name='project',
            name='basemap',
            field=models.ForeignKey(default=12, to='site.WMSOverlay'),
        ),
        migrations.AddField(
            model_name='project',
            name='last_updated_by',
            field=models.ForeignKey(related_name='site_project_related', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='project',
            name='owner',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='print',
            name='map_provider',
            field=models.ForeignKey(related_name='prints_print_wmsoverlays', db_column=b'fk_provider',
                                    to='site.WMSOverlay'),
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
            model_name='layer',
            name='access_authority',
            field=models.ForeignKey(db_column=b'view_authority', verbose_name=b'Sharing', to='site.ObjectAuthority'),
        ),
        migrations.AddField(
            model_name='layer',
            name='last_updated_by',
            field=models.ForeignKey(related_name='site_layer_related', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='layer',
            name='owner',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='imageopts',
            name='source_scan',
            field=models.ForeignKey(to='site.Scan'),
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
            model_name='fieldlayout',
            name='map_print',
            field=models.ForeignKey(to='site.Print'),
        ),
        migrations.AddField(
            model_name='fieldlayout',
            name='owner',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
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
        migrations.AddField(
            model_name='attachment',
            name='project',
            field=models.ForeignKey(related_name='attachment+', to='site.Project'),
        ),
        migrations.AddField(
            model_name='attachment',
            name='source_print',
            field=models.ForeignKey(blank=True, to='site.Print', null=True),
        ),
        migrations.AddField(
            model_name='attachment',
            name='status',
            field=models.ForeignKey(to='site.StatusCode'),
        ),
        migrations.AddField(
            model_name='attachment',
            name='upload_source',
            field=models.ForeignKey(to='site.UploadSource'),
        ),
        migrations.AlterUniqueTogether(
            name='snapshot',
            unique_together=set([('slug', 'owner')]),
        ),
        migrations.AlterUniqueTogether(
            name='project',
            unique_together=set([('slug', 'owner')]),
        ),
        migrations.AlterUniqueTogether(
            name='layer',
            unique_together=set([('slug', 'owner')]),
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
            name='fieldlayout',
            unique_together=set([('map_print', 'field')]),
        ),
        migrations.AlterUniqueTogether(
            name='field',
            unique_together=set([('col_alias', 'form'), ('col_name_db', 'form')]),
        ),
        migrations.RunPython(load_fixture),
        #migrations.RunSQL(load_sql()),

        #helper view to concatenate shared users:
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_projects_shared_with AS
                 SELECT g.id, g.name, array_to_string(array_agg(u.username), ', ') AS shared_with
                   FROM site_project g, site_userauthorityobject a, auth_user u
                  WHERE g.id = a.object_id AND a.user_id = u.id AND a.content_type_id = (select id from django_content_type where model = 'project')
                  GROUP BY g.id, g.name;"""),
        #helper view to concatenate shared users
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_views_shared_with AS
                 SELECT g.id, g.name, array_to_string(array_agg(u.username), ', ') AS shared_with
                   FROM site_snapshot g, site_userauthorityobject a, auth_user u
                  WHERE g.id = a.object_id AND a.user_id = u.id AND a.content_type_id = ( SELECT django_content_type.id
                           FROM django_content_type
                          WHERE django_content_type.model = 'snapshot')
                  GROUP BY g.id, g.name;"""),
        #helper view to concatenate form fields
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_form_fields as
                 SELECT g.id, g.name, array_to_string(array_agg(f.col_alias), ', '::text) AS form_fields
                   FROM site_form g, site_field f
                  WHERE g.id = f.form_id
                  GROUP BY g.id, g.name;
                    """),
        #A view to show all of the projects, who can access
        #them, and at what security level (view, edit, or manage)
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_projects AS
            SELECT v.id, v.name, v.user_id, max(v.authority_id) AS authority_id
             FROM (
              (SELECT g.id, g.name, a.user_id, a.authority_id
              FROM site_project g, site_userauthorityobject a
              WHERE g.id = a.object_id AND a.content_type_id = (select id from django_content_type where model = 'project'))
                UNION
              (SELECT site_project.id, site_project.name, site_project.owner_id AS user_id, 3 AS authority_id
              FROM site_project)
            ) v
            GROUP BY v.id, v.name, v.user_id;
            """),
        #A view to show all of the "views", who can access
        #them, and at what security level (view, edit, or manage)
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_views AS
            SELECT v.id, v.name, v.user_id, max(v.authority_id) AS authority_id
            FROM
            (
                SELECT g.id, g.name, a.user_id, a.authority_id
                FROM site_snapshot g, site_userauthorityobject a
                WHERE g.id = a.object_id
                    AND a.content_type_id = (select id from django_content_type where model = 'snapshot')
              UNION
                SELECT id, name, owner_id as user_id, 3 AS authority_id
                FROM site_snapshot
            ) v
            GROUP BY v.id, v.name, v.user_id;
            """),
        #A view to show all of the presentations, who can access
        #them, and at what security level (view, edit, or manage)
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_presentations AS
            SELECT v.id, v.name, v.user_id, max(v.authority_id) AS authority_id
            FROM
            (
                SELECT g.id, g.name, a.user_id, a.authority_id
                FROM site_presentation g, site_userauthorityobject a
                WHERE g.id = a.object_id
                    AND a.content_type_id = (select id from django_content_type where model = 'presentation')
              UNION
                SELECT id, name, owner_id as user_id, 3 AS authority_id
                FROM site_presentation
            ) v
            GROUP BY v.id, v.name, v.user_id;
            """),
        #A view to show all of the forms, who can access
        #them, and at what security level (view, edit, or manage)
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_forms AS
            SELECT v.id, v.name, v.user_id, max(v.authority_id) AS authority_id
             FROM (
              --users who have been given direct access to a form:
              SELECT g.id, g.name, a.user_id, a.authority_id
              FROM site_form g, site_userauthorityobject a
              WHERE g.id = a.object_id AND a.content_type_id = (select id from django_content_type where model = 'form')
                UNION
              --form owners:
              SELECT site_form.id, site_form.name, site_form.owner_id AS user_id, 3 AS authority_id
              FROM site_form
                UNION
              --users who have been given access to a form via their projects:
              SELECT fp.form_id as id, p.name, p.user_id, p.authority_id
              FROM site_form_projects fp, v_private_projects p
              WHERE fp.project_id = p.id
            ) v
            GROUP BY v.id, v.name, v.user_id;
            """),
        #A view to show all of the layers, who can access
        #them, and at what security level (view, edit, or manage)
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_layers AS
            SELECT v.id, v.name, v.user_id, max(v.authority_id) AS authority_id
            FROM
            (
                SELECT g.id, g.name, a.user_id, a.authority_id
                FROM site_layer g, site_userauthorityobject a
                WHERE g.id = a.object_id
                    AND a.content_type_id = (select id from django_content_type where model = 'layer')
              UNION
                SELECT id, name, owner_id as user_id, 3 AS authority_id
                FROM site_layer
            ) v
            GROUP BY v.id, v.name, v.user_id;"""),
        #A view to show all of the media (form records, markers,
        #photos, audio, scans, and video) that has been made
        #accessible to a particular set of users based on the parent
        #view's permissions, and at what security level (view, edit, or manage)

        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_view_accessible_media AS
            SELECT m.id as view_id, m.name, t1.model as parent,
              a.entity_id as id, t2.model as child,
              m.user_id, m.authority_id
            FROM site_genericassociation a, django_content_type t1,
              django_content_type t2, v_private_views m
            WHERE a.source_type_id = t1.id and t1.model = 'snapshot' and
              a.entity_type_id = t2.id and a.source_id = m.id;"""),
        #A view to show all of the markers, who can access
        #them, and at what security level (view, edit, or manage)
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_markers AS
            SELECT v.id, v.user_id, max(v.authority_id) AS authority_id
            FROM  (
                -- accessible via view permissions
                SELECT id, user_id, authority_id
                FROM v_private_view_accessible_media
                WHERE child = 'marker'
              UNION
                -- accessible via project permissions
                SELECT m.id, p.user_id, p.authority_id
                FROM site_marker m, v_private_projects p
                WHERE m.project_id = p.id
              UNION
                -- accessible because is marker owner
                SELECT m.id, m.owner_id, 3 AS authority_id
                FROM site_marker m
            ) v
            GROUP BY v.id, v.user_id;"""),
        #A view to show all of the media (form records, markers,
        #photos, audio, scans, and video) that has been made
        #accessible to a particular set of users based on the
        #accessibility of a parent marker (is read-only)
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_marker_accessible_media AS
            SELECT m.id as marker_id, t1.model as parent,
              a.entity_id as id, t2.model as child,
              m.user_id, 1 as authority_id
            FROM site_genericassociation a, django_content_type t1,
              django_content_type t2, v_private_markers m
            WHERE a.source_type_id = t1.id and t1.model = 'marker' and
              a.entity_type_id = t2.id and a.source_id = m.id;"""),
        #v_private_associated_media
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_associated_media AS
             SELECT v.id, v.child, v.user_id, max(v.authority_id) AS authority_id
               FROM (         SELECT v_private_marker_accessible_media.id, v_private_marker_accessible_media.child, v_private_marker_accessible_media.user_id, v_private_marker_accessible_media.authority_id
                               FROM v_private_marker_accessible_media
                    UNION
                             SELECT v_private_view_accessible_media.id, v_private_view_accessible_media.child, v_private_view_accessible_media.user_id, v_private_view_accessible_media.authority_id
                               FROM v_private_view_accessible_media) v
              GROUP BY v.id, v.child, v.user_id;"""),
        #View: v_private_audio
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_audio AS
            SELECT v.id, v.user_id, max(v.authority_id) AS authority_id
            FROM  (
                -- accessible from view and marker permissions via associations
                SELECT id, user_id, authority_id
                FROM v_private_associated_media
                WHERE child = 'audio'
              UNION
                -- accessible via project permissions
                SELECT m.id, p.user_id, p.authority_id
                FROM site_audio m, v_private_projects p
                WHERE m.project_id = p.id
              UNION
                -- accessible b/c user is audio owner
                SELECT m.id, m.owner_id, 3 AS authority_id
                FROM site_audio m, site_project g
                WHERE m.project_id = g.id) v
            GROUP BY v.id, v.user_id;"""),
        #View: v_private_photos
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_photos AS
            SELECT v.id, v.user_id, max(v.authority_id) AS authority_id
            FROM  (
                -- accessible from view and marker permissions via associations
                SELECT id, user_id, authority_id
                FROM v_private_associated_media
                WHERE child = 'photo'
              UNION
                -- accessible via project permissions
                SELECT m.id, p.user_id, p.authority_id
                FROM site_photo m, v_private_projects p
                WHERE m.project_id = p.id
              UNION
                -- accessible b/c user is photo owner
                SELECT m.id, m.owner_id, 3 AS authority_id
                FROM site_photo m, site_project g
                WHERE m.project_id = g.id) v
            GROUP BY v.id, v.user_id;
            """),
        #View: v_private_scans
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_scans AS
            SELECT v.id, v.user_id, max(v.authority_id) AS authority_id
            FROM  (
                -- accessible from view and marker permissions via associations
                SELECT id, user_id, authority_id
                FROM v_private_associated_media
                WHERE child = 'scan'
              UNION
                -- accessible via project permissions
                SELECT m.id, p.user_id, p.authority_id
                FROM site_scan m, v_private_projects p
                WHERE m.project_id = p.id
              UNION
                -- accessible b/c user is scan owner
                SELECT m.id, m.owner_id, 3 AS authority_id
                FROM site_scan m, site_project g
                WHERE m.project_id = g.id) v
            GROUP BY v.id, v.user_id;"""),
        #View: v_private_videos
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_videos AS
            SELECT v.id, v.user_id, max(v.authority_id) AS authority_id
            FROM  (
                -- accessible from view and marker permissions via associations
                SELECT id, user_id, authority_id
                FROM v_private_associated_media
                WHERE child = 'video'
              UNION
                -- accessible via project permissions
                SELECT m.id, p.user_id, p.authority_id
                FROM site_video m, v_private_projects p
                WHERE m.project_id = p.id
              UNION
                -- accessible b/c user is scan owner
                SELECT m.id, m.owner_id, 3 AS authority_id
                FROM site_video m, site_project g
                WHERE m.project_id = g.id) v
            GROUP BY v.id, v.user_id;
            """),
        #View: v_private_attachments
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_attachments AS
            SELECT v.id, v.user_id, max(v.authority_id) AS authority_id
            FROM  (
                -- accessible via project permissions
                SELECT m.id, p.user_id, p.authority_id
                FROM site_attachment m, v_private_projects p
                WHERE m.project_id = p.id
              UNION
                -- accessible b/c user is attachment owner
                SELECT m.id, m.owner_id, 3 AS authority_id
                FROM site_attachment m
            ) v
            GROUP BY v.id, v.user_id;
            """),
        #View: v_private_prints
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_private_prints AS
            SELECT v.id, v.user_id, max(v.authority_id) AS authority_id
            FROM  (
                -- accessible via project permissions
                SELECT m.id, p.user_id, p.authority_id
                FROM site_print m, v_private_projects p
                WHERE m.project_id = p.id
              UNION
                -- accessible b/c user is print owner
                SELECT m.id, m.owner_id, 3 AS authority_id
                FROM site_print m
            ) v
            GROUP BY v.id, v.user_id;
            """),
        #View: v_public_photos
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_public_photos AS
             SELECT t.id, max(t.view_authority) AS view_authority, array_to_string(array_agg(t.access_key), ','::text) AS access_keys
               FROM (         SELECT a.entity_id AS id, v.view_authority, v.access_key
                               FROM site_genericassociation a, site_snapshot v
                              WHERE a.source_id = v.id
                                AND a.source_type_id = (select id from django_content_type where model = 'snapshot')
                                AND a.entity_type_id = (select id from django_content_type where model = 'photo')
                    UNION
                             SELECT p.id, pr.view_authority, pr.access_key
                               FROM site_photo p, site_project pr
                              WHERE p.project_id = pr.id) t
              WHERE t.view_authority > 1
              GROUP BY t.id;
            """),
        #View: v_public_audio
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_public_audio AS
            select t.id, max(t.view_authority) as view_authority,
                array_to_string(array_agg(t.access_key), ',') as access_keys
            from
            (
            select a.entity_id as id, v.view_authority, v.access_key
            from site_genericassociation a, site_snapshot v
            where
              a.source_id = v.id and
              a.source_type_id = (select id from django_content_type where model = 'snapshot') and
              a.entity_type_id = (select id from django_content_type where model = 'audio')
            union
            select a.id, pr.view_authority, pr.access_key
            from site_audio a, site_project pr
             where a.project_id = pr.id
            ) t
            where t.view_authority > 1
            group by t.id;
            """),
        #View: v_public_markers
        migrations.RunSQL("""CREATE OR REPLACE VIEW v_public_markers AS
            select t.id, max(t.view_authority) as view_authority,
                array_to_string(array_agg(t.access_key), ',') as access_keys
            from
            (
            select a.entity_id as id, v.view_authority, v.access_key
            from site_genericassociation a, site_snapshot v
            where
              a.source_id = v.id and
              a.source_type_id = (select id from django_content_type where model = 'snapshot') and
              a.entity_type_id = (select id from django_content_type where model = 'marker')
            union
            select m.id, pr.view_authority, pr.access_key
            from site_marker m, site_project pr
             where m.project_id = pr.id
            ) t
            where t.view_authority > 1
            group by t.id;
            """),


    ]
