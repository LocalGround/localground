from rest_framework import renderers

class GeoJSONRenderer(renderers.JSONRenderer):
    """
    Renderer which serializes to GeoJSON.
    """
    format = 'geojson'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        Render `data` into GeoJSON, returning a bytestring.
        """   
        if data is None:
            return bytes()
        
        """ Pre-processing to put dictionary into GeoJSON Format """
        geoResults = []
        
        # List Views (multiple records)
        if data.get('results'):
            for entry in data.get('results'):
                d = {
                    "type": "Feature",
                    "properties": entry
                }
                if entry.get("geometry"):
                    d.update({ "geometry": entry.pop("geometry") })
                # incorporate extras dictionary into properties:
                if entry.get('extras'):
                    entry.update(entry.pop("extras"))
                geoResults.append(d)
            data["type"] = "FeatureCollection"
            data["features"] = geoResults
            data.pop("results")
        
        # Detail Views (single record)
        else:
            d = {
                "type": "Feature",
                "properties": data 
            }
            if data.get("geometry"):
                d.update({ "geometry": data.pop("geometry") })# incorporate extras dictionary into properties:
            if data.get('extras'):
                data.update(data.pop("extras"))
            data = d
            
        return super(GeoJSONRenderer, self).render(
            data, accepted_media_type=accepted_media_type, renderer_context=renderer_context
        )