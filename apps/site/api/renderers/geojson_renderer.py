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
        
        # List Views
        if data.get('results'):
            for entry in data.get('results'):
                geoResults.append({
                    "type": "Feature",
                    "geometry": entry.pop("geometry"),
                    "properties": entry
                })
            data["type"] = "FeatureCollection"
            data["features"] = geoResults
            data.pop("results")
        else:
            data = {
               "type": "Feature",
                "geometry": data.pop("geometry"),
                "properties": data 
            }
        return super(GeoJSONRenderer, self).render(
            data, accepted_media_type=accepted_media_type, renderer_context=renderer_context
        )