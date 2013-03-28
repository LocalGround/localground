#!/usr/bin/env python
import sys, os
from gps_file import GPSFile
from particle_file import ParticleFile
from carbon_file import CarbonFile

def process_carbon_file(file_names):
    for file_name in file_names:
        print 'Processing %s...' % file_name
        if file_name.upper().find('.LOG') != -1:
            gf = GPSFile(file_name)
            gf.load_file()
            #gf.print_records()
            print('gps file loaded')
        else:
            cf = CarbonFile(file_name)
            cf.load_file()
            print('carbon file loaded')
    
    print('Zipping coordinates...')
    cf.zip_coordinates(gf.records)
    cf.to_csv()
    cf.print_records()
    
def process_particle_file(file_names, lat=None, lng=None, title=None):
    gf, pf = None, None
    for file_name in file_names:
        print 'Processing %s...' % file_name
        if file_name.upper().find('.LOG') != -1:
            gf = GPSFile(file_name)
            gf.load_file()
            gf.print_records()
            print('gps file loaded')
            raw_input('waiting...')
        else:
            pf = ParticleFile(file_name)
            pf.load_file()
            pf.print_records()
            print('particle file loaded')
            raw_input('waiting...')
    
    if gf is not None:
        print('Zipping coordinates...')
        pf.zip_coordinates(gf.records)
    elif lat is not None and lng is not None:
        for rec in pf.records:
            rec.lat = lat
            rec.lng = lng
            
    pf.to_csv()
    pf.populate_database(title=title)
    #pf.print_records()



if __name__ == '__main__':
    documentation = \
    '''
        3 arguments are required:
        ---------------------------------------------------------------------------
        flag:  -type {{ particle | carbon }}
        arg 1:  path_to_particle_or_carbon_file
        arg 2:  path_to_gps_file
        
        1 named argument optional:
        ---------------------------------------------------------------------------
        title:  -title {{ name_of_data_collection }}
        
        Examples:
        ---------------------------------------------------------------------------
        $ python driver.py -type particle ../data/my_csv.csv ../data/my_gps_log.log 
        $ python driver.py -type carbon ../data/my_dat.dat ../data/my_gps_log.log -title '03-19-13 - De Jean Group A'
        $ python driver.py -type carbon ../data/my_dat.dat ../data/my_gps_log.log 

    '''
    file_names, lat, lng, title = None, None, None, None
    if len(sys.argv) not in [4, 5, 7]:
        print documentation
        exit()
    #get title:
    if len(sys.argv) == 7:
       title = sys.argv[6]
       print title
       
    #get files:
    if len(sys.argv) in [5, 7]:
        file_names = [sys.argv[3], sys.argv[4]]
    else:
        file_names = [sys.argv[3]]
        print 'No GPS file found'
        flag = raw_input('Would you like to enter a GPS coordinate? ')
        if flag.strip() in ['Y', 'y', '1']:
            try:
                lat = float(raw_input('Enter a lat: ').strip())
                lng = float(raw_input('Enter a lng: ').strip())
                #lat = 37.794406
                #lng = -122.39675
            except:
                lat, lng = None, None
            
    
    if sys.argv[2] == 'particle':
        #process particle file:
        process_particle_file(file_names, lat=lat, lng=lng, title=title)
    else:
        process_carbon_file(file_names, title=title)
        
    

