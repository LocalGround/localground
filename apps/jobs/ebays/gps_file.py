#!/usr/bin/env python
import sys, os
from datetime import datetime
from xml.dom.minidom import parseString
from base_classes import Record, DataFile

class GPSRecord(Record):
    
    def __init__(self, elem):
        super(GPSRecord, self).__init__()
        time_val = None
        try:
            time_tag = elem.getElementsByTagName('time')[0]
            time_val = time_tag.firstChild.nodeValue        #2012-07-12T22:33:28Z
            time_val = time_val.replace('T', ' ')
            time_val = time_val.replace('60Z', '00Z')       #totally weird error w/GPX file
            time_val = time_val.replace('Z', '')
        except:
            time_val = None
        if time_val is not None:
            print time_val
            self.date_time = datetime.strptime(time_val, '%Y-%m-%d %H:%M:%S')
            #localize to timezone:
            self.convert_to_pacific_time()
            
        self.lat = float(elem.getAttribute('lat'))
        self.lng = float(elem.getAttribute('lon'))
            

    def __str__(self):
        return '%s \t %s \t %s' % (self.format_datetime(),
                             self.lat, self.lng)    

class GPSFile(DataFile):
    def __init__(self, file_name):
        self.original_file = file_name
        self.gpx_file = file_name.replace('log', 'gpx')
        self.records = []
        try:
            print 'Trying to open a previously generated GPX file...'
            f = open(self.gpx_file)
        except IOError:
            print 'Generating a new GPX file...'
            commands = [
                'ogr2ogr',
                '-f', '"GPX"',
                self.gpx_file,
                'GPSBabel:nmea:%s' % self.original_file
            ]
            command = ' '.join(commands)
            print command
            result = os.popen(command)
            for line in result.readlines():
                print line
    
    def load_file(self):
        file = open(self.gpx_file)
        data = file.read()
        file.close()
        dom = parseString(data)
        elems = dom.getElementsByTagName('trkpt')
        for e in elems:
            self.records.append(GPSRecord(e))
        #self.print_records()

