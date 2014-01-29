#!/usr/bin/env python

from datetime import datetime, timedelta
from base_classes import Record, SpatialFile

class CarbonRecord(Record):
    
    def __init__(self, line):
        super(CarbonRecord, self).__init__()
        line = line.replace('\n', '')
        cells = line.split(';')
        try:
            date_time_str = '%s %s' % (cells[0], cells[1])
            self.date_time = datetime.strptime(date_time_str, '%Y/%m/%d %H:%M:%S')
            #self.date_time += timedelta(hours=5, minutes=30)
            self.ref = int(cells[2])
            self.sen = int(cells[3])
            self.atn = float(cells[4])
            self.flow = int(cells[5])
            self.temp = int(cells[6])
        except:
            print 'error processing: %s' % line
        
        
    def __str__(self):
        return '%s   %s   %s   %s   %s   %.2f   %s   %s' % (
            self.format_datetime(), self.format_lat(), self.format_lng(),
            self.ref, self.sen, self.atn, self.flow, self.temp
        )
        
    

class CarbonFile(SpatialFile):
    def __init__(self, file_name):
        self.file_name = file_name
        self.records = []
        
    def load_file(self):
        start_loading_records = False
        f = open(self.file_name)
        for line in f.readlines():
            if not start_loading_records:
                line = line.replace('\n', '')
                cells = line.split(';')
                if cells[0].strip() == 'Date(yyyy/MM/dd)':
                    start_loading_records = True
            else:
                if len(line.split(';')) > 5:
                    self.records.append(CarbonRecord(line))
        f.close()
        
    def to_csv(self):
        csv_file_name = self.file_name.replace('.dat', '_GPS.csv')
        f = open(csv_file_name, 'w')
        f.write('DATE,LAT,LON,REF,SEN,ATN,FLOW,TEMP\n')
        for rec in self.records:
            f.write('%s,%s,%s,%s,%s,%.2f,%s,%s\n' % (
                rec.format_datetime(), rec.format_lat(), rec.format_lng(),
                rec.ref, rec.sen, rec.atn, rec.flow, rec.temp
            ))
        f.close()


