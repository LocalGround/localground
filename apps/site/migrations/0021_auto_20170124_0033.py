# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import os

def get_extra_sql():
    from localground.apps.settings import APPS_ROOT
    sql_statements = open(os.path.join(APPS_ROOT, 'sql/custom.sql'), 'r').read()
    return sql_statements

class Migration(migrations.Migration):

    dependencies = [
        ('site', '0020_styledmap_project'),
    ]

    operations = [
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
        migrations.AddField(
            model_name='layer',
            name='data_property',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='layer',
            name='filters',
            field=jsonfield.fields.JSONField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='layer',
            name='layer_type',
            field=models.CharField(default=b'basic', max_length=64, choices=[(b'categorical', b'Category'), (b'continuous', b'Continuous'), (b'basic', b'Basic'), (b'individual', b'Individual Sites')]),
        ),
        migrations.AddField(
            model_name='layer',
            name='styled_map',
            field=models.ForeignKey(related_name='layer+', default=3, to='site.StyledMap'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='layer',
            name='symbol_shape',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='layer',
            name='title',
            field=models.CharField(default='default title', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='layer',
            unique_together=set([('title', 'styled_map')]),
        ),
        migrations.RemoveField(
            model_name='layer',
            name='access_authority',
        ),
        migrations.RemoveField(
            model_name='layer',
            name='access_key',
        ),
        migrations.RemoveField(
            model_name='layer',
            name='name',
        ),
        migrations.RemoveField(
            model_name='layer',
            name='slug',
        ),
        migrations.RemoveField(
            model_name='layer',
            name='tags',
        ),
        migrations.RunSQL(get_extra_sql()),
        migrations.AlterModelTable(
            name='mapimageuser',
            table='v_private_mapimages',
        )
    ]
