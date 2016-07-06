import csv
from StringIO import StringIO
from rest_framework import renderers


class CSVRenderer(renderers.BaseRenderer):
    """
    Renderer which serializes to CSV
    """
    media_type = 'text/csv'
    format = 'csv'
    level_sep = '.'
    
    def generate_csv(self, headers, data):
        csv_buffer = StringIO()
        csv_writer = csv.DictWriter(csv_buffer, fieldnames=headers)
        csv_writer.writeheader()
        for row in data:
            self.flatten_data(row)
            for cell in row:
                if isinstance(row[cell], basestring):
                    row[cell] = unicode(row[cell]).encode("utf-8")
            try:
                csv_writer.writerow(row)
            except:
                raise Exception(isinstance(row['name'], basestring))
        return csv_buffer.getvalue()
    
    def flatten_data(self, row):
        # make lat / lng into their own cells:
        geom = row.get('geometry')
        if geom and geom.get('type') == 'Point': # lon, lat order
            row['lng'] = geom.get('coordinates')[0]
            row['lat'] = geom.get('coordinates')[1]
        
        # flatten tags:
        if row.get('tags') is not None:
            row['tags'] = ', '.join(row.get('tags'))
    
    def process_instances_with_children(self, data, headers):
        '''
        Builds dataset array with child records (for projects & markers):
        '''
        # add top-level record:
        top_level_record = data.copy()
        del top_level_record['children']
        dataset = [top_level_record]
        headers += top_level_record.keys()
        
        # add child records:
        children = data.get('children')
        for key in children:
            child_records = children.get(key).get('data')
            dataset += child_records
            if len(child_records) > 0:
                headers += child_records[0].keys()
        return headers, dataset
    
    def process_record_instances_with_foreign_keys(self, row, headers):
        for key in row.keys():
            if '_detail' in key and isinstance(row.get(key), dict):
                child = row.get(key)
                for k in child:
                    header = '{}.{}'.format(key, k)
                    headers.append(header)
                    row[header] = child[k]
                del row[key]
    
    
    def render(self, data, media_type=None, renderer_context=None):
        """
        Renders serialized data into CSV. For a dictionary:
        """
        dataset = []
        headers = []
        overlay_type = None

        # list renderer:
        if 'results' in data:
            dataset = data.get('results')
            if len(dataset) > 0:
                overlay_type = dataset[0].get('overlay_type')
                headers += dataset[0].keys()
                
        # instance renderer:
        elif 'overlay_type' in data:
            overlay_type = data.get('overlay_type')
            # if hierarchical object, then flatten (for project or marker):
            if overlay_type in ['project', 'marker']:
                headers, dataset = self.process_instances_with_children(data, headers)
            else:
                headers = data.keys()
                dataset = [data]
        
        # special post-processing for record objects with nested foreign keys:
        for row in dataset:
            if 'form_' in row.get('overlay_type'):
                self.process_record_instances_with_foreign_keys(row, headers)        
        
        if len(dataset) > 0:
            if 'geometry' in headers and overlay_type != 'map-image':
                headers += ['lat', 'lng']
            headers = list(set(headers))
            headers.sort()
            return self.generate_csv(headers, dataset)
        return None
