#!/usr/bin/env python
from datetime import datetime, timedelta
from base_classes import Record, SpatialFile
class ParticleRecord(Record):
    
    def __init__(self, line, start_datetime, particle_size):
        super(ParticleRecord, self).__init__()
        line = line.replace('\n', '')
        cells = line.split(',')
        seconds_elapsed = int(cells[0])
        self.date_time = start_datetime + timedelta(seconds=seconds_elapsed)
        self.particle_size = particle_size
        self.value = float(cells[1]) #Mass [mg/m3]
        
        
    def __str__(self):
        return '%s \t %s \t %s \t %s \t %s' % (
            self.date_time.strftime('%m/%d/%y %I:%M:%S %p'),
            self.lat, self.lng, self.particle_size, self.value)
        
    

class ParticleFile(SpatialFile):
    def __init__(self, file_name):
        self.file_name = file_name
        self.start_datetime = None
        self.particle_size = 2.5
        self.records = []
        
    def load_file(self):
        start_loading_records = False
        f = open(self.file_name)
        start_time,start_date, interval = None, None, None
        for line in f.readlines():
            if not start_loading_records:
                line = line.replace('\n', '')
                cells = line.split(',')
                if cells[0].strip() == 'Test Start Time':
                    start_time = cells[1].replace('\r', '')
                elif cells[0].strip() == 'Test Start Date':
                    start_date = cells[1].replace('\r', '')
    
                if cells[0] == 'Elapsed Time [s]':
                    start_loading_records = True
                    self.start_datetime = datetime.strptime(start_date + ' ' + start_time, '%m/%d/%Y %I:%M:%S %p')
            else:
                self.records.append(ParticleRecord(line, self.start_datetime, self.particle_size))
        f.close()
        #self.print_records()
        
    def to_csv(self):
        csv_file_name = self.file_name.replace('.csv', '_GPS.txt')
        f = open(csv_file_name, 'w')
        f.write('DATE,LAT,LON,SIZE,VALUE\n')
        for rec in self.records:
            f.write(
                '"%s",%s,%s,%s,%s\n' % (rec.format_datetime(), rec.format_lat(),
                                        rec.format_lng(), rec.particle_size,
                                        rec.value)
            )
        f.close()
        
    def populate_database(self):
        self.setup_environment()
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
        for rec in self.records:
            d = dict(
                col_1=rec.date_time,
                col_2=rec.particle_size,
                col_3=rec.value,
                col_4=self.start_datetime.strftime('%m-%d-%y @ %I:%M %p'), #Collection Event
                col_5=self.file_name, #Source File
                last_updated_by=me,
                owner=me,
                project=prj
            )
            if rec.lat is not None:
                d.update(dict(point=Point(rec.lng, rec.lat, srid=4326)))
            list_of_dictionaries.append(d)
        print('list of dictionaries built: %s entries' % len(list_of_dictionaries))
        form.add_records_batch(list_of_dictionaries, me)


