define(["lib/maps/geometry/polyline"], function() {
	/** 
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
	localground.maps.geometry.Polygon = function(){
		localground.maps.geometry.Polyline.call(this);
		
		/**
		 * Method that converts a GeoJSON Linestring into
		 * an array of google.maps.LatLng objects.
		 * @param {GeoJSON Linestring} geoJSON
		 * A GeoJSON Linestring object
		 * @returns {Array}
		 * An array of google.maps.LatLng objects.
		 */
		this.getGooglePath = function(geoJSON){
			var path = [];
			var coords = geoJSON.coordinates[0];
			for (var i = 0; i < coords.length; i++){
				path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
			}
			path.pop();
			return path;
		};
		
		this.getCenterPoint = function(googleOverlay) {
			return this.getBounds(googleOverlay).getCenter();
		};
		
		this.getCenterPointFromGeoJSON = function(geoJSON) {
			var coords = this.getGooglePath(geoJSON);
			var bounds = new google.maps.LatLngBounds();
			for (var i = 0; i < coords.length; i++) {
				bounds.extend(coords[i]);
			}
			return bounds.getCenter();
		};
	};
	
});