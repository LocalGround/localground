define([], function() {
    /** 
     * Class that controls marker point model overlays.
     * @class Point
     */
	localground.maps.overlays.Point = function (opts) {

		opts = opts || {};
		this.map = opts.map;
		this.model = opts.model;
		this.getGoogleOverlay = null;
		
		/** Shortcut to @link {localground.maps.geometry.Point} object */
		var Point = localground.maps.geometry.Point;
		
		/**
		 * Creates a google.maps.Marker overlay with a photo icon
		 * if one doesn't already exist, and returns it.
		 * @returns {google.maps.Marker}
		 */
		this.getGoogleOverlay = function(){
			if (this.googleOverlay == null) {
				this.googleOverlay = new google.maps.Marker({
					position: Point.getGoogleLatLng(this.model.get("geometry"))
				});
			}
			return this.googleOverlay;
		};
		
		this.getIcon = function(){
			return null;
		};
		
		this.show = function(){
			var overlay = this.getGoogleOverlay();
			overlay.setMap(this.map);
			overlay.setIcon(this.getIcon());
		};
		
		this.hide = function(){
			var overlay = this.getGoogleOverlay();
			overlay.setMap(null);
		};
		
		this.zoomTo = function(){
			var overlay = this.getGoogleOverlay();
			this.map.panTo(overlay.getPosition());
		};
				
	};
	return localground.maps.overlays.Point;
});