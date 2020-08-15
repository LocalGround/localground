# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import django.contrib.postgres.fields
from django.conf import settings
import localground.apps.lib.helpers


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('site', '0060_record_tags'),
    ]

    operations = [
        migrations.CreateModel(
            name='Dataset',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('tags', django.contrib.postgres.fields.ArrayField(default=list, base_field=models.TextField(), size=None)),
                ('date_created', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds)),
                ('time_stamp', models.DateTimeField(default=localground.apps.lib.helpers.get_timestamp_no_milliseconds, db_column='last_updated')),
                ('table_name', models.CharField(unique=True, max_length=255)),
                ('last_updated_by', models.ForeignKey(on_delete=models.CASCADE, related_name='site_dataset_related', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=models.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=models.CASCADE, related_name='dataset+', to='site.Project')),
            ],
            options={
                'verbose_name': 'dataset',
                'verbose_name_plural': 'datasets',
            },
        ),
        migrations.RemoveField(
            model_name='form',
            name='last_updated_by',
        ),
        migrations.RemoveField(
            model_name='form',
            name='owner',
        ),
        migrations.RemoveField(
            model_name='form',
            name='project',
        ),
        migrations.RemoveField(
            model_name='record',
            name='form',
        ),
        migrations.AlterField(
            model_name='layer',
            name='dataset',
            field=models.ForeignKey(on_delete=models.CASCADE, related_name='layer+', to='site.Dataset'),
        ),
        migrations.AlterField(
            model_name='layer',
            name='metadata',
            field=jsonfield.fields.JSONField(default='{"width": 20, "shape": "circle", "fillOpacity": 1, "fillColor": "#4e70d4", "strokeWeight": 1, "buckets": 4, "isShowing": false, "strokeColor": "#ffffff", "strokeOpacity": 1, "paletteId": 0}', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='layer',
            name='symbols',
            field=jsonfield.fields.JSONField(default=[{b'strokeWeight': 1, b'strokeOpacity': 1, b'height': 25, b'shape': b'circle', b'fillOpacity': 1, b'strokeColor': b'#ffffff', b'title': b'Untitled Symbol', b'isShowing': True, b'rule': b'*', b'width': 25, b'fillColor': b'rgb(253, 191, 111)'}], null=True, blank=True),
        ),
        migrations.RemoveField(
            model_name='field',
            name='form',
        ),
        migrations.AddField(
            model_name='field',
            name='dataset',
            field=models.ForeignKey(on_delete=models.CASCADE, default=1, to='site.Dataset'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='record',
            name='dataset',
            field=models.ForeignKey(on_delete=models.CASCADE, to='site.Dataset', null=True),
        )
    ]
