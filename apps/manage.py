#!/usr/bin/python
import os, sys

cwd = os.path.dirname(os.path.realpath(__file__))
apps = os.path.dirname(cwd)
workspace = os.path.dirname(apps)

print '-'*70
print 'Custom environment settings:'
print 'Current working directory: %s' % cwd
print 'Apps directory: %s' % apps
print 'Current workspace: %s' % workspace
print '-'*70

HOST = os.environ.get('DB_HOST', '127.0.0.1')               #Your Database Host
PORT = os.environ.get('DB_PORT', '5432')                    #Your Database Port
USERNAME = os.environ.get('DB_USERNAME', 'DB_USER')         #Your Database Username
PASSWORD = os.environ.get('DB_PASSWORD', 'DB_PASSWORD')     #Your Database Password
DATABASE = os.environ.get('DB_NAME', 'DB_NAME')             #Your Database Name

print HOST, PORT, USERNAME, PASSWORD, DATABASE


sys.path.append(workspace) 

try:
    import localground.apps.settings # Assumed to be in the same directory.
except ImportError:
    sys.stderr.write("Error: Can't find the file 'settings.py' in the directory containing %r. It appears you've customized things.\nYou'll have to run django-admin.py, passing it your settings module.\n(If the file settings.py does indeed exist, it's causing an ImportError somehow.)\n" % __file__)
    sys.exit(1)

if __name__ == "__main__":
    #execute_manager(localground.apps.settings)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "localground.apps.settings")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
