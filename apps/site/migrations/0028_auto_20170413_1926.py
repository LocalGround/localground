# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0027_tileset_attribution'),
    ]

    operations = [
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
        migrations.AlterField(
            model_name='print',
            name='map_provider',
            field=models.ForeignKey(related_name='prints_print_tilesets', db_column=b'fk_provider', to='site.TileSet'),
        ),
        migrations.AlterField(
            model_name='project',
            name='basemap',
            field=models.ForeignKey(default=3, to='site.TileSet'),
        ),
        migrations.AlterField(
            model_name='snapshot',
            name='basemap',
            field=models.ForeignKey(default=3, to='site.TileSet'),
        ),
        migrations.AlterField(
            model_name='styledmap',
            name='basemap',
            field=models.ForeignKey(default=3, to='site.TileSet'),
        ),
        migrations.DeleteModel(
            name='WMSOverlay',
        ),
    ]
