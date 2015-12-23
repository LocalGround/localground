# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0006_remove_print_sorted_field_ids'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='fieldlayout',
            unique_together=set([]),
        ),
        migrations.RemoveField(
            model_name='fieldlayout',
            name='field',
        ),
        migrations.RemoveField(
            model_name='fieldlayout',
            name='last_updated_by',
        ),
        migrations.RemoveField(
            model_name='fieldlayout',
            name='map_print',
        ),
        migrations.RemoveField(
            model_name='fieldlayout',
            name='owner',
        ),
        migrations.DeleteModel(
            name='FieldLayout',
        ),
    ]
