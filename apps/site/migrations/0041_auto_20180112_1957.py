# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0040_icons_merged'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='markerwithattributes',
            options={'ordering': ['id'], 'verbose_name': 'marker with attributes', 'verbose_name_plural': 'marker with attributes'},
        ),
        migrations.AddField(
            model_name='icon',
            name='content_type',
            field=models.CharField(default='png', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='icon',
            name='file_type',
            field=models.CharField(max_length=63, verbose_name=b'file type', choices=[(b'svg', b'svg'), (b'jpg', b'jpg'), (b'png', b'png'), (b'gif', b'gif')]),
        ),
    ]
