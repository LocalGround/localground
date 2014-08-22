define([
		"lib/maps/geometry/polyline",
		"lib/maps/overlays/overlay"
		], function() {
    /** 
     * Class that controls marker point model overlays.
     * @class Point
     */
	localground.maps.overlays.Polyline = function (opts) {
		localground.maps.overlays.Overlay.call(this, opts);
		
		/** Shortcut to @link {localground.maps.geometry.Polyline} object */
		var polyline = new localground.maps.geometry.Polyline();

		/**
		 * Creates a new.maps.Polyline object.
		 */
		this.createOverlay = function(){
			this.googleOverlay = new google.maps.Polyline({
				path: polyline.getGooglePath(this.model.get("geometry")),
				strokeColor: '#' + this.model.get("color"),
				strokeOpacity: 1.0,
				strokeWeight: 5,
				map: this.isVisible ? this.map : null
			});
			this.attachEventHandlers();
		};
		
		this.zoomTo = function(){
			this.map.fitBounds(this.getBounds());
		};
		
		this.getCenter = function(){
			//delegates to Polyline geometry object:
			return polyline.getCenterPoint(this.getGoogleOverlay());
		};
		
		this.getBounds = function(){
			//delegates to Polyline geometry object:
			return polyline.getBounds(this.getGoogleOverlay());		
		};
		
		this.getGeoJSON = function(){
			return polyline.getGeoJSON(this.getGoogleOverlay());		
		};
		
		this.calculateDistance = function(){
			return polyline.calculateDistance(this.getGoogleOverlay());	
		};
	};
	return localground.maps.overlays.Overlay;
});