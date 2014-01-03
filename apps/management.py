from django.db.models import signals

def make_update(app, created_models, verbosity, **kwargs):
	from django.contrib.auth.models import User
	u = User.objects.get(id=1)
	u.first_name = "sarah is awesome"
	u.save()
	
	
	
import os, sys
from django.db.models import signals
from django.db import connection, transaction
from django.conf import settings

			
def load_customized_sql(app, created_models, verbosity=2, **kwargs):
	app_dir = os.path.join(settings.APPS_ROOT, 'sql')
	custom_files = os.listdir(app_dir)
	for custom_file in custom_files: 
		#if os.path.exists(custom_file):
		print "Loading customized SQL for %s" % app.__name__
		fp = open(os.path.join(app_dir, custom_file), 'U')
		cursor = connection.cursor()
		#try:
		cursor.execute(fp.read().decode(settings.FILE_CHARSET))
		#except Exception, e:
		#	sys.stderr.write("Couldn't execute custom SQL for %s" % app.    __name__)
		#	import traceback
		#	traceback.print_exc()
		#	transaction.rollback_unless_managed()
		#else:
		transaction.commit_unless_managed()

signals.post_syncdb.connect(load_customized_sql)
