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

DB_HOST = os.environ.get('DB_HOST', '127.0.0.1')               #Your Database Host
DB_PORT = os.environ.get('DB_PORT', '5432')                    #Your Database Port
DB_USER = os.environ.get('DB_USER', 'DB_USER')         #Your Database Username
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'DB_PASSWORD')     #Your Database Password
DB_NAME = os.environ.get('DB_NAME', 'DB_NAME')             #Your Database Name

print '-'*70
print 'Environment Variables'
print 'DB_HOST: %s' % DB_HOST
print 'DB_PORT: %s' % DB_PORT
print 'DB_USER: %s' % DB_USER
print 'DB_PASSWORD: %s' % DB_PASSWORD
print 'DB_NAME: %s' % DB_NAME
print '-'*70

sys.path.append(workspace) 

import localground.apps.settings
if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "localground.apps.settings")
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
