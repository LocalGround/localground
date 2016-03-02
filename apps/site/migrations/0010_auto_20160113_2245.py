# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from tagging.models import TaggedItem

def convert_tags(apps, schema_editor):
	# TAP - This didnt work?		
	# TaggedItem = apps.get_model("tagging", "TaggedItem")
	tagitems = TaggedItem.objects.all()
	tagitems = tagitems.select_related('tag')
   
	for tagitem in tagitems:
		tagitem.object.newtags.append(tagitem.tag.name)
		tagitem.object.save()

class Migration(migrations.Migration):

    dependencies = [
        ('site', '0009_auto_20160113_2138'),
    ]

#    operations = [
#    	migrations.RunPython(convert_tags)
#    ]
