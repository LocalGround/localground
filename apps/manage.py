#!/usr/bin/python
import os, sys
from django.core.management import execute_manager

cwd = os.getcwd()
apps = os.path.dirname(cwd)
workspace = os.path.dirname(apps)

print '-'*70
print 'Custom environment settings:'
print 'Current working directory: %s' % cwd
print 'Apps directory: %s' % apps
print 'Current workspace: %s' % workspace
print '-'*70

sys.path.append(workspace) 

try:
    import localground.apps.settings # Assumed to be in the same directory.
except ImportError:
    sys.stderr.write("Error: Can't find the file 'settings.py' in the directory containing %r. It appears you've customized things.\nYou'll have to run django-admin.py, passing it your settings module.\n(If the file settings.py does indeed exist, it's causing an ImportError somehow.)\n" % __file__)
    sys.exit(1)

if __name__ == "__main__":
    execute_manager(localground.apps.settings)
