#!/usr/bin/env python
import pytz
from pytz import timezone
from datetime import datetime, timedelta
import sys

class Record(object):
    '''base class'''
    def __init__(self):
        self.date_time = None
        self.lat = None
        self.lng = None
        
    def format_datetime(self):
        if self.date_time is not None:
            return self.date_time.strftime('%Y-%m-%d %H:%M:%S')
        else:
            return ''
        
    def convert_to_pacific_time(self):
        pacific = timezone('US/Pacific')
        self.date_time = pacific.localize(self.date_time)
        offset = int(self.date_time.strftime('%Z%z')[-5:])/100
        self.date_time += timedelta(hours=offset)
        #convert to plain datetime object:
        self.date_time = datetime.strptime(self.format_datetime(), '%Y-%m-%d %H:%M:%S')
        
        
    def format_lat(self):
        if self.lat is not None:
            return '%.6f' % self.lat
        else:
            return ''
        
    def format_lng(self):
        if self.lat is not None:
            return '%.6f' % self.lng
        else:
            return ''
        
class DataFile(object):
    '''
    Also a base class
    '''
    def print_records(self, limit=None):
        if limit is None:
            for rec in self.records:
                print rec
        else:
            for rec in self.records[:limit]:
                print rec
            
            
    def setup_environment(self):
        from django.core.management import setup_environ
        settings_path = '/usr/local/django/localground'
        sys.path.append(settings_path)
        import settings
        setup_environ(settings)
            
class SpatialFile(DataFile):
    
    def zip_coordinates(self, coordinate_records):
        print 'Number of particle records: %s' % len(self.records)
        print 'Number of GPS records: %s' % len(coordinate_records)
        geocoded = 0
        j = 0
        for i, data_rec in enumerate(self.records):
            if data_rec.date_time is None:
                continue
            if j == len(coordinate_records) - 1:
                break
            try:
                while coordinate_records[j].date_time is None or \
                        coordinate_records[j].date_time <= data_rec.date_time:
                    try:
                        if coordinate_records[j].date_time > data_rec.date_time:
                            break
                    
                        if data_rec.format_datetime() == coordinate_records[j].format_datetime():
                            geocoded += 1
                            self.records[i].lat = coordinate_records[j].lat
                            self.records[i].lng = coordinate_records[j].lng
                    except:
                        pass
                    
                    j += 1
            except:
                print 'There was an error.'
                print 'Number of particle records: %s' % len(self.records)
                print 'Number of GPS records: %s' % len(coordinate_records)
                print 'Record counter (i): %s' % i
                print 'GPS record counter (j): %s' % j
                raw_input('Press Enter to print records')
                self.print_records()
        print '%s out of %s geocoded' % (geocoded, len(self.records))
        #self.print_records()

