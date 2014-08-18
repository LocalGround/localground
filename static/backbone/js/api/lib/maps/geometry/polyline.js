define([], function() {
	/** 
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polyline
     */
	localground.maps.geometry.Polyline = {
		
		/**
		 * Static method that converts a google.maps.Polyline
		 * into a GeoJSON Linestring object.
		 * @param {google.maps.Polyline} googlePolyline
		 * A Google polyline object.
		 * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polyline">google.maps.Polyline</a>
		 * documentation for more details.
		 * @returns a GeoJSON Linestring object
		 */
		getGeoJSON: function(googlePolyline){
			var pathCoords = googlePolyline.getPath().getArray();
			var coords = [];
			for (var i = 0; i < pathCoords.length; i++){
				coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
			}
			return { type: 'LineString', coordinates: coords };
		},
		
		/**
		 * Static method that converts a GeoJSON Linestring into
		 * an array of google.maps.LatLng objects.
		 * @param {GeoJSON Linestring} geoJSON
		 * A GeoJSON Linestring object
		 * @returns {Array}
		 * An array of google.maps.LatLng objects.
		 */
		getGooglePath: function(geoJSON){
			var path = [];
			var coords = geoJSON.coordinates;
			//console.log(coords);
			for (var i = 0; i < coords.length; i++){
				path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
			}
			//console.log(path);
			return path;
		},
		
		/**
		 * Static method that calculates the length of a
		 * google.maps.Polyline (in miles)
		 * @param {google.maps.Polyline} googlePolyline
		 * A Google polyline object.
		 * @returns {Number}
		 * The length of the google.maps.Polyline object in miles.
		 */
		calculateDistance: function(googlePolyline) {
			var coords = googlePolyline.getPath().getArray();
			var distance = 0;
			for (var i=1; i < coords.length; i++) {
				distance += google.maps.geometry.spherical.computeDistanceBetween(coords[i-1], coords[i]);
			}
			return Math.round( distance / 1609.34 * 100 ) / 100;
		},
		
		/**
		 * Static method that calculates the bounding box of a
		 * google.maps.Polyline (in miles)
		 * @param {google.maps.Polyline} googlePolyline
		 * A Google polyline object.
		 * @returns {google.maps.LatLngBounds}
		 * The bounding box.
		 */
		getBounds: function(googlePolyline) {
			var bounds = new google.maps.LatLngBounds();
			var coords = googlePolyline.getPath().getArray();
			for (var i = 0; i < coords.length; i++) {
				bounds.extend(coords[i]);
			}
			return bounds;
		},
		
		/**
		 * An approximation for the center point of a polyline.
		 * @param {google.maps.Polyline} googlePolyline
		 * @returns {google.maps.LatLng}
		 * A latLng corresponding the approximate center of the
		 * polyline.
		 */
		getCenterPoint: function(googlePolyline) {
			var coordinates = this.googleOverlay.getPath().getArray();
			return coordinates[Math.floor(coordinates.length/2)];
		}
	};
	return localground.maps.geometry.Polyline;
});