# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0003_marker_extras'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attachment',
            name='last_updated_by',
        ),
        migrations.RemoveField(
            model_name='attachment',
            name='owner',
        ),
        migrations.RemoveField(
            model_name='attachment',
            name='project',
        ),
        migrations.RemoveField(
            model_name='attachment',
            name='source_print',
        ),
        migrations.RemoveField(
            model_name='attachment',
            name='status',
        ),
        migrations.RemoveField(
            model_name='attachment',
            name='upload_source',
        ),
        migrations.RemoveField(
            model_name='snippet',
            name='last_updated_by',
        ),
        migrations.RemoveField(
            model_name='snippet',
            name='owner',
        ),
        migrations.RemoveField(
            model_name='snippet',
            name='source_attachment',
        ),
        migrations.RemoveField(
            model_name='field',
            name='display_width',
        ),
        migrations.RemoveField(
            model_name='field',
            name='has_snippet_field',
        ),
        migrations.RemoveField(
            model_name='field',
            name='is_printable',
        ),
        migrations.DeleteModel(
            name='Attachment',
        ),
        migrations.DeleteModel(
            name='Snippet',
        ),
    ]
