# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import localground.apps.lib.helpers
import localground.apps.site.models.abstract.media


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('site', '0030_video_attribution'),
    ]

    operations = [
        migrations.CreateModel(
            name='Icon',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column=b'last_updated')),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('file_type', models.CharField(max_length=63, verbose_name=b'file type', choices=[(b'svg', b'svg'), (b'jpeg', b'jpeg'), (b'png', b'png')])),
                ('width', models.FloatField()),
                ('height', models.FloatField()),
                ('host', models.CharField(max_length=255)),
                ('virtual_path', models.CharField(max_length=255)),
                ('file_name_orig', models.CharField(max_length=255)),
                ('file_name_new', models.CharField(max_length=255)),
                ('x_position', models.FloatField()),
                ('y_position', models.FloatField()),
                ('last_updated_by', models.ForeignKey(related_name='site_icon_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(related_name='icon+', to='site.Project')),
            ],
            options={
                'ordering': ['id'],
                'verbose_name': 'icon',
                'verbose_name_plural': 'icons',
            },
            bases=(localground.apps.site.models.abstract.media.BaseMediaMixin, models.Model),
        ),
    ]
