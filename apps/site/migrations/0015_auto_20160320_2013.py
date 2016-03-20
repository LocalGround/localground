# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('site', '0014_auto_20160320_2010'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='statuscode',
            options={'ordering': ('id',)},
        ),
        migrations.AlterField(
            model_name='mapimage',
            name='last_updated_by',
            field=models.ForeignKey(related_name='site_mapimage_related', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='mapimage',
            name='project',
            field=models.ForeignKey(related_name='mapimage+', to='site.Project'),
        ),
    ]
