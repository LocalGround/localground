# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import localground.apps.lib.helpers
import localground.apps.site.models.abstract.media


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('site', '0039_merge'),
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
        migrations.RenameField(
            model_name='icon',
            old_name='x_position',
            new_name='anchor_x',
        ),
        migrations.RenameField(
            model_name='icon',
            old_name='y_position',
            new_name='anchor_y',
        ),
        migrations.AlterField(
            model_name='icon',
            name='anchor_x',
            field=models.FloatField(help_text=b'Icon anchor point - x coordinate'),
        ),
        migrations.AlterField(
            model_name='icon',
            name='anchor_y',
            field=models.FloatField(help_text=b'Icon anchor point - y coordinate'),
        ),
        migrations.AlterField(
            model_name='icon',
            name='file_type',
            field=models.CharField(max_length=63, verbose_name=b'file type', choices=[(b'svg', b'svg'), (b'jpg', b'jpg'), (b'png', b'png')]),
        ),
        migrations.AddField(
            model_name='icon',
            name='size',
            field=models.IntegerField(default=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='icon',
            name='anchor_x',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='icon',
            name='anchor_y',
            field=models.FloatField(),
        ),
        migrations.AddField(
            model_name='icon',
            name='file_name_resized',
            field=models.CharField(default=50, max_length=255),
            preserve_default=False,
        )
    ]
