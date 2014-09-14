define([
        "lib/maps/geometry/point",
        "lib/maps/geometry/polyline",
        "lib/maps/geometry/polygon",
    ], function() {
	/** 
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Point
     */
	localground.maps.geometry.Geometry = function(){
        this.point = null;
        this.polyline = null;
        this.polygon = null;
        
        this.getGeoJSON = function(googleObject) {
            if (googleObject instanceof google.maps.LatLng) {
                return this.point.getGeoJSON(googleObject);
            }
            else if (googleObject instanceof google.maps.Marker) {
                return this.point.getGeoJSON(googleObject.position);
            }
            else if (googleObject instanceof google.maps.Polyline) {
                return this.polyline.getGeoJSON(googleObject.getPath());
            }
            else if (googleObject instanceof google.maps.Polygon) {
                return this.polygon.getGeoJSON(googleObject.getPath());
            }
            else {
                alert("Not an instance of a defined type!");
                return null;
            }
        };
        
        this.initialize = function(){
            this.point = new localground.maps.geometry.Point();
            this.polyline = new localground.maps.geometry.Polyline();
            this.polygon = new localground.maps.geometry.Polygon();    
        };
        
        this.initialize();
        
    };
    return localground.maps.geometry.Geometry;
});