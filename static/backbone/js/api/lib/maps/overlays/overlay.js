define(["lib/maps/geometry/point"], function() {
    /** 
     * Class that controls marker point model overlays.
     * @class Overlay
     */
	localground.maps.overlays.Overlay = function (opts) {

		opts = opts || {};
		this.map = opts.map;
		this.model = opts.model;
		this.isVisible = opts.isVisible;
		this.eventManager = opts.eventManager;
		this.getGoogleOverlay = null;
		
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
				
				//attach click event:
				var that = this;
				google.maps.event.addListener(this.googleOverlay, 'click', function() {
					that.eventManager.trigger("show_bubble", that.model, that.getCenter());
				});
			}
			return this.googleOverlay;
		};
		
		this.createOverlay = function(){
			alert("implement in child class");	
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
		 * Calculates the approximate center point of the
		 * google.maps overlay (if necessary) and returns it.
		 * @returns {google.maps.LatLng} object
		 */
		this.getCenter = function(){
			return this.getGoogleOverlay().getPosition();
		};
				
	};
	return localground.maps.overlays.Overlay;
});