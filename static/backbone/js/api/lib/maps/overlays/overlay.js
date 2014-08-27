define(["lib/maps/geometry/point"], function() {
    /** 
     * Class that controls marker point model overlays.
     * @class Overlay
     */
	localground.maps.overlays.Overlay = function (sb, opts) {

		opts = opts || {};
		this.sb = sb;
		this.map = sb.getMap();
		this.model = opts.model;
		this.isVisible = opts.isVisible;
		
		/** called when object created */
		this.initialize = function(){
			if(this.isVisible) {this.createOverlay(); }	
		};
		
		/**
		 * Creates a google.maps.Marker overlay with a photo icon
		 * if one doesn't already exist, and returns it.
		 * @returns {Object}
		 * Either a google.maps.Marker, google.maps.Polyline,
		 * google.maps.Polygon, or google.maps.GroundOverlay
		 */
		this.getGoogleOverlay = function(){
			if (this.googleOverlay == null) {
				this.createOverlay();
			}
			return this.googleOverlay;
		};
		
		this.createOverlay = function(){
			alert("implement in child class");	
		};
		
		this.attachEventHandlers = function(){
			var that = this;
			//attach click event:
			google.maps.event.addListener(this.googleOverlay, 'click', function() {
				that.sb.notify({
					type : "show-bubble",
					data : { model: that.model, center: that.getCenter() } 
				});
			});
			//attach mouseover event:
			google.maps.event.addListener(this.googleOverlay, 'mouseover', function() {
				that.sb.notify({
					type : "show-tip",
					data : { model: that.model, center: that.getCenter() } 
				});
			});
			//attach mouseout event:
			google.maps.event.addListener(this.googleOverlay, 'mouseout', function() {
				that.sb.notify({
					type : "hide-tip",
				});
			});
		};
		
		/** shows the google.maps overlay on the map. */
		this.show = function(){
			var overlay = this.getGoogleOverlay();
			overlay.setMap(this.map);
		};
		
		/** hides the google.maps overlay from the map. */
		this.hide = function(){
			var overlay = this.getGoogleOverlay();
			overlay.setMap(null);
		};
		
		/** zooms to the google.maps overlay. */
		this.zoomTo = function(){
			this.map.panTo(this.getCenter());
			if(this.map.getZoom() <17){ this.map.setZoom(17); }
		};
		
		/** centers the map at the google.maps overlay */
		this.centerOn = function(){
			this.map.panTo(this.getCenter());
		};
		
		/**
		 * Calculates the approximate center point
		 * @returns {google.maps.LatLng} object
		 */
		this.getCenter = function(){
			return this.getGoogleOverlay().getPosition();
		};
		
		this.destroy = function(){
			alert("bye");	
		};
	};
	return localground.maps.overlays.Overlay;
});