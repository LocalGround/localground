define([
		"lib/maps/geometry/polygon",
		"lib/maps/overlays/overlay"
		], function() {
    /** 
     * Class that controls marker point model overlays.
     * @class Polygon
     */
	localground.maps.overlays.Polygon = function (opts) {
		localground.maps.overlays.Overlay.call(this, opts);
		
		/** Shortcut to @link {localground.maps.geometry.Point} object */
		var polygon = new localground.maps.geometry.Polygon();
		
		/**
		 * Creates a new.maps.Polygon object.
		 */
		this.createOverlay = function(){
			this.googleOverlay = new google.maps.Polygon({
				path: polygon.getGooglePath(this.model.get("geometry")),
				strokeColor: '#' + this.model.get("color"),
				strokeOpacity: 1.0,
				strokeWeight: 5,
				fillColor: '#' + this.model.get("color"),
				fillOpacity: 0.35,
				map: this.isVisible ? this.map : null
			});
		};
		
		this.zoomTo = function(){
			this.map.fitBounds(this.getBounds());
		};
		
		this.getBounds = function(){
			//delegates to Polyline geometry object:
			return polygon.getBounds(this.getGoogleOverlay());		
		};

		this.getCenter = function(){
			//delegates to Polyline geometry object:
			return polygon.getCenterPoint(this.getGoogleOverlay());
		};
				
	};
	return localground.maps.overlays.Polygon;
});