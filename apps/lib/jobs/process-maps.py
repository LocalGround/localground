import sys
import traceback
import os
from datetime import datetime
   
LOCK_FILE_PATH = 'process-maps.py.lock'
def is_locked():
   return False
   try:
      open(LOCK_FILE_PATH)
      return True
   except IOError as e:
      return False
   
def create_lock_file():
   print(datetime.now())
   print('Creating the lock file...')
   f = open(LOCK_FILE_PATH, 'w')
   f.write('The map processing script is running.')
   f.close()
   
def remove_lock_file():
   try:
      os.remove(LOCK_FILE_PATH)
      print(datetime.now())
      print('Lock file removed')
   except:
      print(datetime.now())
      print('No lock file detected')


def setup_environment():
   from django.core.management import setup_environ
   dirs = os.getcwd().split('/')
   settings_path = '/'.join(dirs[:len(dirs)-2])
   print 'Settings path: %s' % settings_path
   sys.path.append(settings_path)
   jobs = os.getcwd()
   lib = os.path.dirname(jobs)
   apps = os.path.dirname(lib)
   localground = os.path.dirname(apps)
   workspace = os.path.dirname(localground)
   print '-'*70
   print 'Custom environment settings:'
   print 'Current working directory: %s' % jobs
   print 'Apps directory: %s' % apps
   print 'Local Ground directory: %s' % localground
   print 'Current workspace: %s' % workspace
   print '-'*70
   sys.path.append(workspace)
   
   import settings
   setup_environ(settings)

if __name__ == '__main__':
   if is_locked():
      print('Lock file detected: process already running.')
      exit()

   #ensure that the localground directory location is added to
   #the system path:
   setup_environment()
   
   #write lock file to indicate that there's already a process running:
   create_lock_file()
   
   from localground.apps.site import models
   
   ############################
   # First, process all scans #
   ############################
   scans = models.Scan.objects.filter(status__id=1)
   print('%s scans are about to be processed' % len(scans))
   
   #loop through the scans and process them:
   try:
      for scan in scans:
         try:
            scan.process()
         except SystemExit:
            print('trying to catch a SystemExit exception')
            traceback.print_exc()
            pass #there was an error:  go to the next scan
   except:
      #remove lock file to indicate that the process has finished
      traceback.print_exc()
      #remove_lock_file()
      
      
   #################################
   # Next, process all attachments #
   #################################
   attachments = models.Attachment.objects.filter(status__id=1)
   print('%s attachments are about to be processed' % len(attachments))
   
   #loop through the scans and process them:
   try:
      for attachment in attachments:
         try:
            attachment.process()
         except SystemExit:
            print('trying to catch a SystemExit exception')
            traceback.print_exc()
            pass #there was an error:  go to the next attachment
   except:
      #remove lock file to indicate that the process has finished
      traceback.print_exc()
   
   #remove lock file to indicate that the process has finished
   remove_lock_file()
