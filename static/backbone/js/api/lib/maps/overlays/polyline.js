define(["lib/maps/geometry/polyline"], function() {
    /** 
     * Class that controls marker point model overlays.
     * @class Point
     */
	localground.maps.overlays.Polyline = function (opts) {
		localground.maps.overlays.Overlay.call(this, opts);
		
		/** Shortcut to @link {localground.maps.geometry.Polyline} object */
		var Polyline = localground.maps.geometry.Polyline;

		/**
		 * Returns a google.maps.Polyline object and creates one if
		 * the model's geometry is defined.
		 * @return {google.maps.Polyline}
		 */
		this.getGoogleOverlay = function(){
			if (this.googleOverlay == null) {
				this.googleOverlay = new google.maps.Polyline({
					path: Polyline.getGooglePath(this.model.get("geometry")),
					strokeColor: this.model.get("color"),
					strokeOpacity: 1.0,
					strokeWeight: 5
				});
				if (this.isVisible)
					this.googleOverlay.setMap(this.map);
			}
			return this.googleOverlay;
		};
		
		this.zoomTo = function(){
			this.map.fitBounds(this.getBounds());
		};
		
		this.getCenter = function(){
			//delegates to Polyline geometry object:
			return Polyline.getCenterPoint(this.getGoogleOverlay());
		};
		
		this.getBounds = function(){
			//delegates to Polyline geometry object:
			return Polyline.getBounds(this.getGoogleOverlay());		
		};
		
		this.getGeoJSON = function(){
			return Polyline.getGeoJSON(this.getGoogleOverlay());		
		};
		
		this.calculateDistance = function(){
			return Polyline.calculateDistance(this.getGoogleOverlay());	
		};
	};
	return localground.maps.overlays.Overlay;
});