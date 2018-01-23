# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import localground.apps.site.fields


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0043_merge'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='markerwithattributes',
            options={'ordering': ['id'], 'verbose_name': 'marker with attributes', 'verbose_name_plural': 'marker with attributes'},
        ),
        migrations.RemoveField(
            model_name='photo',
            name='media_file',
        ),
        migrations.AddField(
            model_name='print',
            name='map_image_path_S3',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
        migrations.AddField(
            model_name='print',
            name='pdf_path_S3',
            field=localground.apps.site.fields.LGFileField(null=True, upload_to=b''),
        ),
        migrations.AlterField(
            model_name='audio',
            name='media_file',
            field=localground.apps.site.fields.LGFileField(null=True, upload_to=b''),
        ),
        migrations.AlterField(
            model_name='audio',
            name='media_file_orig',
            field=localground.apps.site.fields.LGFileField(null=True, upload_to=b''),
        ),
        migrations.AlterField(
            model_name='photo',
            name='media_file_large',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
        migrations.AlterField(
            model_name='photo',
            name='media_file_marker_lg',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
        migrations.AlterField(
            model_name='photo',
            name='media_file_marker_sm',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
        migrations.AlterField(
            model_name='photo',
            name='media_file_medium',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
        migrations.AlterField(
            model_name='photo',
            name='media_file_medium_sm',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
        migrations.AlterField(
            model_name='photo',
            name='media_file_orig',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
        migrations.AlterField(
            model_name='photo',
            name='media_file_small',
            field=localground.apps.site.fields.LGImageField(null=True, upload_to=b''),
        ),
    ]
