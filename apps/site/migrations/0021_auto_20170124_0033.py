# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields

class Migration(migrations.Migration):

    dependencies = [
        ('site', '0020_styledmap_project'),
    ]

    operations = [
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
            field=models.CharField(default='basic', max_length=64, choices=[(b'categorical', b'Category'), (b'continuous', b'Continuous'), (b'basic', b'Basic'), (b'individual', b'Individual Sites')]),
        ),
        migrations.AddField(
            model_name='layer',
            name='styled_map',
            field=models.ForeignKey(on_delete=models.CASCADE, related_name='layer+', default=3, to='site.StyledMap'),
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
        )
    ]
