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
			this._googleOverlay = new google.maps.Polygon({
				path: this.getGooglePathFromGeoJSON(),
				strokeColor: '#' + this.model.get("color"),
				strokeOpacity: 1.0,
				strokeWeight: 5,
				fillColor: '#' + this.model.get("color"),
				fillOpacity: 0.35,
				map: isVisible ? this.map : null
			});
		};
		
		this.redraw = function(){
			this._googleOverlay.setOptions({
				strokeColor: '#' + this.model.get("color"),
				fillColor: '#' + this.model.get("color"),
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
		this.getGooglePathFromGeoJSON = function(){
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
		
		/**
		 * Method that converts a google.maps.Polygon
		 * into a GeoJSON Linestring object.
		 * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polygon">google.maps.Polygon</a>
		 * documentation for more details.
		 * @returns a GeoJSON Polygon object
		 */
		this.getGeoJSON = function(){
			var pathCoords = this._googleOverlay.getPath().getArray();
			var coords = [];
			for (var i = 0; i < pathCoords.length; i++){
				coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
			}
			//add last coordinate again:
			coords.push([pathCoords[0].lng(), pathCoords[0].lat()])
			return { type: 'Polygon', coordinates: [coords] };
		};
		
		this.initialize(sb, opts);
	};
	return localground.maps.overlays.Polygon;
});