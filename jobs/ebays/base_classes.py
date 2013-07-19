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
            for i, rec in enumerate(self.records):
                print rec
                if i % 500 == 0:
                    raw_input('waiting...')
        else:
            for i, rec in enumerate(self.records[:limit]):
                print rec
            
            
    def setup_environment(self):
	import os
        from django.core.management import setup_environ
        #settings_path = '/usr/local/django/localground'
	#settings_path = '/var/www/django/localground'
	path = os.getcwd()
	path = os.path.abspath(os.path.join(path, os.pardir))
	settings_path = os.path.abspath(os.path.join(path, os.pardir))
        sys.path.append(settings_path)
        import settings
        setup_environ(settings)
            
class SpatialFile(DataFile):
    
    def zip_coordinates_old(self, coordinate_records):
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
                            
                        print i, j, len(coordinate_records), data_rec.format_datetime(), coordinate_records[j].format_datetime(), \
                            data_rec.format_datetime() == coordinate_records[j].format_datetime()
                    except:
                        pass
                    
                    j += 1
            except:
                print 'There was an error.'
                print 'Number of particle records: %s' % len(self.records)
                print 'Number of GPS records: %s' % len(coordinate_records)
                print 'Record counter (i): %s' % i
                print 'GPS record counter (j): %s' % j
                #raw_input('Press Enter to print records')
                #self.print_records()
        print '%s out of %s geocoded' % (geocoded, len(self.records))
        #self.print_records()
        
        
    def zip_coordinates(self, coordinate_records):
        num_data_recs = len(self.records)
        num_gps_recs = len(coordinate_records)
        print 'Number of particle records: %s' % num_data_recs
        print 'Number of GPS records: %s' % num_gps_recs
        geocoded, i, j = 0, 0, 0
        while i < num_data_recs - 1 and j < num_gps_recs - 1:
            data_rec = self.records[i]
            gps_rec = coordinate_records[j]
            print i, j, data_rec.date_time, gps_rec.date_time, data_rec.date_time == gps_rec.date_time
            if data_rec.date_time is None:
                i += 1
            elif gps_rec.date_time is None:
                j += 1
            elif data_rec.date_time < gps_rec.date_time:
                i += 1
            elif data_rec.date_time > gps_rec.date_time:
                j += 1
            else:
                self.records[i].lat = gps_rec.lat
                self.records[i].lng = gps_rec.lng
                geocoded += 1
                i += 1
                j += 1
            if j % 500 == 0:
                raw_input('waiting...')
        print '%s out of %s geocoded' % (geocoded, num_data_recs)
        raw_input('waiting...')
        #471 2193        
                  
                

