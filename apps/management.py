import os
from django.db.models import signals
from django.db import connection, transaction
from django.conf import settings

			
def load_customized_sql(app, created_models, verbosity=2, **kwargs):
	'''
	This function loads any sql files in the apps/sql directory.
	'''
	app_dir = os.path.join(settings.APPS_ROOT, 'sql')
	custom_files = os.listdir(app_dir)
	for custom_file in custom_files:
		# if-statement exists so that the custom sql only
		# syncdb process the *last* installed app:
		if app.__name__ == settings.INSTALLED_APPS[-1] + ".models":
			print("Loading customized SQL for %s" % app.__name__)
			fp = open(os.path.join(app_dir, custom_file), 'U')
			cursor = connection.cursor()
			cursor.execute(fp.read().decode(settings.FILE_CHARSET))

signals.post_syncdb.connect(load_customized_sql)
