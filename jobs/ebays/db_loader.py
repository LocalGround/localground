#!/usr/bin/env python

class Loader(object):
    def load_records_from_directory(self, directory_path='files', start=0, end=10):
        import os
        import glob
        files = glob.glob(os.path.join(directory_path, '*.txt'))
        print('There are %s files in this directory' % len(files))
        for infile in files[start:end]:
            print('Loading records from %s' % infile)
            recs = self.load_records_from_file(file_path=infile)
            m.populate_database(recs)
    

def setup_environment():
   from django.core.management import setup_environ
   dirs = os.getcwd().split('/')
   settings_path = '/'.join(dirs[:len(dirs)-1])
   sys.path.append(settings_path)
   import settings
   setup_environ(settings)

