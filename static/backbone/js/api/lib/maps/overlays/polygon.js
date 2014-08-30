define(["lib/maps/overlays/polyline"], function() {
	/** 
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
	localground.maps.overlays.Polygon = function(sb, opts){
		localground.maps.overlays.Polyline.call(this, sb, opts);
		
		this.getType = function(){
			return "Polygon";
		};
		
		this.createOverlay = function(isVisible){
			this.googleOverlay = new google.maps.Polygon({
				path: this.getGooglePath(),
				strokeColor: '#' + this.model.get("color"),
				strokeOpacity: 1.0,
				strokeWeight: 5,
				fillColor: '#' + this.model.get("color"),
				fillOpacity: 0.35,
				map: isVisible ? this.map : null
			});
		};
		/**
		 * Method that converts a GeoJSON Linestring into
		 * an array of google.maps.LatLng objects.
		 * @param {GeoJSON Linestring} geoJSON
		 * A GeoJSON Linestring object
		 * @returns {Array}
		 * An array of google.maps.LatLng objects.
		 */
		this.getGooglePath = function(){
			var geoJSON = this.model.get("geometry");
			var path = [];
			var coords = geoJSON.coordinates[0];
			for (var i = 0; i < coords.length; i++){
				path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
			}
			path.pop();
			return path;
		};
		
		this.getCenterPoint = function() {
			return this.getBounds().getCenter();
		};
		
		this.initialize(sb, opts);
	};
	return localground.maps.overlays.Polygon;
});