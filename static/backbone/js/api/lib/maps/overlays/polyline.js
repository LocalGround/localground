define([], function() {
    /** 
     * Class that controls marker point model overlays.
     * @class Point
     */
	localground.maps.overlays.Polyline = function(sb, opts) {
		
		this._googleOverlay = null;
		this.model = null;
		this.map = null;
		
		this.getType = function(){
			return "Polyline";
		};
		
		this.initialize = function(sb, opts){
			this.sb = sb;
			$.extend(this, opts);
			this.createOverlay(opts.isVisible || false);
		};
		
		this.createOverlay = function(isVisible){
			this._googleOverlay = new google.maps.Polyline({
				path: this.getGooglePathFromGeoJSON(),
				strokeColor: '#' + this.model.get("color"),
				strokeOpacity: 1.0,
				strokeWeight: 5,
				map: isVisible ? this.map : null
			});
		};
		
		this.redraw = function(){
			this._googleOverlay.setOptions({
				strokeColor: '#' + this.model.get("color")
			});	
		};

		/**
		 * An approximation for the center point of a polyline.
		 * @param {google.maps.Polyline} googlePolyline
		 * @returns {google.maps.LatLng}
		 * A latLng corresponding the approximate center of the
		 * polyline.
		 */
		this.getCenter =function() {
			var coordinates = this._googleOverlay.getPath().getArray();
			return coordinates[Math.floor(coordinates.length/2)];
		};
		
		this.centerOn = function(){
			this.map.panTo(this.getCenter());
		};
		
		this.zoomTo = function(){
			this.map.fitBounds(this.getBounds());
		};
		
		/**
		 * Method that calculates the bounding box of a
		 * google.maps.Polyline (in miles)
		 * @param {google.maps.Polyline} googlePolyline
		 * A Google polyline object.
		 * @returns {google.maps.LatLngBounds}
		 * The bounding box.
		 */
		this.getBounds = function() {
			var bounds = new google.maps.LatLngBounds();
			var coords = this._googleOverlay.getPath().getArray();
			for (var i = 0; i < coords.length; i++) {
				bounds.extend(coords[i]);
			}
			return bounds;
		};
		
		/**
		 * Method that converts a google.maps.Polyline
		 * into a GeoJSON Linestring object.
		 * @param {google.maps.Polyline} googlePolyline
		 * A Google polyline object.
		 * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polyline">google.maps.Polyline</a>
		 * documentation for more details.
		 * @returns a GeoJSON Linestring object
		 */
		this.getGeoJSON = function(){
			var pathCoords = this._googleOverlay.getPath().getArray();
			var coords = [];
			for (var i = 0; i < pathCoords.length; i++){
				coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
			}
			return { type: 'LineString', coordinates: coords };
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
			var coords = geoJSON.coordinates;
			for (var i = 0; i < coords.length; i++){
				path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
			}
			return path;
		};
		
		/**
		 * Method that calculates the length of a
		 * google.maps.Polyline (in miles)
		 * @param {google.maps.Polyline} googlePolyline
		 * A Google polyline object.
		 * @returns {Number}
		 * The length of the google.maps.Polyline object in miles.
		 */
		this.calculateDistance = function() {
			var coords = this._googleOverlay.getPath().getArray();
			var distance = 0;
			for (var i=1; i < coords.length; i++) {
				distance += google.maps.geometry.spherical.computeDistanceBetween(coords[i-1], coords[i]);
			}
			return Math.round( distance / 1609.34 * 100 ) / 100;
		};
		
		this.makeViewable = function() {
			this._googleOverlay.setOptions({'draggable': false, 'editable': false});
			google.maps.event.clearListeners(this._googleOverlay.getPath());
		};
		
		this.makeEditable = function(model) {
			this._googleOverlay.setOptions({'draggable': false, 'editable': true});
			var that = this;
			google.maps.event.addListener(this._googleOverlay.getPath(), 'set_at', function(e){
				that.saveShape(model);
			});
			google.maps.event.addListener(this._googleOverlay.getPath(), 'remove_at', function(e){
				that.saveShape(model);
			});
			google.maps.event.addListener(this._googleOverlay.getPath(), 'insert_at', function(e){
				that.saveShape(model);
			});
			
			google.maps.event.addListener(this._googleOverlay, 'rightclick', function(e) {
				if (e.vertex == undefined) { return; }
				if (that.googleOverlay.getPath().getLength() <=2) { return; }
				that.sb.notify({
					type: 'show-delete-menu',
					data: {
						googleOverlay: that.googleOverlay,
						point: e.vertex
					}
				});
			});
		};
		
		this.saveShape = function(model){
			model.set("geometry", this.getGeoJSON());
			model.save();	
		};

		this.initialize(sb, opts);
				
	};
	return localground.maps.overlays.Polyline;
});
