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
            self.simplify_geometries(row)
            csv_writer.writerow(row)
        return csv_buffer.getvalue()
    
    def simplify_geometries(self, row):
        geom = row.get('geometry')
        if not geom:
            return
        if geom.get('type') == 'Point': # lon, lat order
            row['lng'] = geom.get('coordinates')[0]
            row['lat'] = geom.get('coordinates')[1]
        

    def render(self, data, media_type=None, renderer_context=None):
        """
        Renders serialized data into CSV. For a dictionary:
        """
        dataset = []
        headers = ['lat', 'lng']

        # list renderer:
        if 'results' in data:
            dataset = data.get('results')
            if len(dataset) > 0:
                headers += dataset[0].keys()
                
        # instance renderer:
        elif 'overlay_type' in data:
            
            # if hierarchical object, then flatten (for project or marker):
            if data.get('overlay_type') in ['project', 'marker']:
                
                # add top-level record:
                top_level_record = data.copy()
                del top_level_record['children']
                dataset += [top_level_record]
                headers += top_level_record.keys()
                
                # add child records:
                children = data.get('children')
                for key in children:
                    child_records = children.get(key).get('data')
                    dataset += child_records
                    if len(child_records) > 0:
                        headers += child_records[0].keys()
            else:
                headers = data.keys()
                dataset = [data]
        
        if len(dataset) > 0:
            headers = list(set(headers))
            headers.sort()
            return self.generate_csv(headers, dataset)
        return None
