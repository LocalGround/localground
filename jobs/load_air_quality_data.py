#!/usr/bin/env python
"""
Helper file for zipping sensor data & GPS data together for easy loading into
Local Ground.  EBAYS-specific, but could easily be incorporated into the upload
tool with some updates to the UI.
"""
import math
import os, sys

class Record:
    #create a constructor:
    def __init__(self, line):
        '''
        each time a user instantiates a Record, we require them to pass in
        a line from the file as an argument.
        '''
        cells = line.split(',')
        self.time_stamp = self.to_date(cells[0])
        if len(cells[1]) > 0 and len(cells[2]) > 0:
            self.lat = float(cells[1])
            self.lng =  float(cells[2])
        else:
            self.lat = None
            self.lng = None
        self.particulate_size = float(cells[3])
        self.value = float(cells[4])
        
    def __str__(self):
        '''
        Prints our object in a nice way.
        '''
        return '{:18} {:<10} {:<10} {:<10.3f} {:<10.3f}'.format(
                                        self.format_date(date_format='just-date'),
                                        self.point[0], self.point[1],
                                        self.particulate_size, self.value)
        
    def to_date(self, str_date):
        '''
        takes a string version of a date (in the format %Y-%m-%d %H:%M:%S)
        and converts it to a datetime object.
        
        Returns:  datetime object
        '''
        from datetime import datetime
        str_date = str_date.replace('"', '')
        return datetime.strptime(str_date, '%Y-%m-%d %H:%M:%S')
        
    def format_date(self, date_format='default'):
        '''
        converts the a datetime object to a formatted string.
        - key word argument:  date_format
        - valid arguments:
            'just-date', 'just-time', 'minute'
        - returns:  a string, formatted to the style specified
        '''
        if date_format == 'just-date':
            return self.time_stamp.strftime('%m/%d/%Y')
        elif date_format == 'just-time':
            return self.time_stamp.strftime('%I:%M:%S %p')
        elif date_format == 'minute':
            return self.time_stamp.strftime('%M')
        else:
            return self.time_stamp.strftime('%m/%d/%Y, %I:%M:%S %p')
    
class RecordManager:
    def __init__(self):
        pass
    
    def load_records_from_file(self, file_path='the_file.txt'):
        recs = []
        num_recs = 0
        f = open(file_path)
        f.readline() #get rid of header row
        for line in f.readlines():
            num_recs += 1
            rec = Record(line)
            recs.append(rec)
        f.close()
        print('%s records have been loaded.' % num_recs)
        return recs
        
    def load_records_from_directory(self, directory_path='files', start=0, end=10):
        import os
        import glob
        files = glob.glob(os.path.join(directory_path, '*.txt'))
        print('There are %s files in this directory' % len(files))
        for infile in files[start:end]:
            print('Loading records from %s' % infile)
            recs = self.load_records_from_file(file_path=infile)
            m.populate_database(recs)
    
    def populate_database(self, recs):
        from django.contrib.auth.models import User
        from localground.prints.models import Form
        from localground.account.models import Project
        from django.contrib.gis.geos import Point
        prj = Project.objects.get(id=100)
        form = Form.objects.get(id=84) #get Air Quality Form:
        me = User.objects.get(id=1)
        m = form.TableModel
        i = 0
        list_of_dictionaries = []
        for rec in recs:
            d = dict(
                col_1=rec.time_stamp,
                col_2=rec.particulate_size,
                col_3=rec.value,
                last_updated_by=me,
                owner=me,
                project=prj
            )
            if rec.lat is not None:
                d.update(dict(point=Point(rec.lng, rec.lat, srid=4326)))
            list_of_dictionaries.append(d)
        print('list of dictionaries built: %s entries' % len(list_of_dictionaries))
        form.add_records_batch(list_of_dictionaries, me)

def setup_environment():
   from django.core.management import setup_environ
   dirs = os.getcwd().split('/')
   settings_path = '/'.join(dirs[:len(dirs)-1])
   sys.path.append(settings_path)
   import settings
   setup_environ(settings)

if __name__ == '__main__':
    setup_environment()
    m = RecordManager()
    the_path = raw_input('Please enter the file path from which to load records: ')
    m.load_records_from_directory(directory_path=the_path)