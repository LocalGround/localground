define([], function() {
    /** 
     * Class that controls photo model overlays.
     * @class Photo
     */
	localground.maps.overlays.Photo = function (opts) {
		/**
		 * @lends localground.maps.overlays.Photo#
		 */
		
		opts = opts || {};
		this.map = opts.map;
		this.model = opts.model;
		this.getGoogleOverlay = null;
		
		/** Shortcut to @link {localground.maps.geometry.Point} object */
		var Point = localground.maps.geometry.Point;
		
		/**
		 * Retrieve a photo map marker, depending on the map's zoom level
		 * @returns google.maps.MarkerImage
		 */
		this.getIcon = function() {
			if (this.map.getZoom() > 18) {
				return this.model.get("path_small");
			}
			else if (this.map.getZoom() > 16) {
				return new google.maps.MarkerImage(
					this.model.get("path_marker_lg"),	// icon
					new google.maps.Size(52, 52),		// size (width, height)
					new google.maps.Point(0,0),			// origin (x, y)
					new google.maps.Point(26, 26)		// anchor (x, y)
				);
			}
			else {
				return new google.maps.MarkerImage(
					this.model.get("path_marker_sm"),	// icon
					new google.maps.Size(20, 20),		// size (width, height)
					new google.maps.Point(0,0),			// origin (x, y)
					new google.maps.Point(10, 10)		// anchor (x, y)
				);
			}
		};
		
		/**
		 * Creates a google.maps.Marker overlay with a photo icon
		 * if one doesn't already exist, and returns it.
		 * @returns {google.maps.Marker}
		 */
		this.getGoogleOverlay = function(){
			if (this.googleOverlay == null) {
				this.googleOverlay = new google.maps.Marker({
					position: Point.getGoogleLatLng(this.model.get("geometry")),
					icon: this.getIcon()
				});
			}
			return this.googleOverlay;
		};
		
		this.show = function(){
			var overlay = this.getGoogleOverlay();
			overlay.setIcon(this.getIcon());
			overlay.setMap(this.map);
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
	return localground.maps.overlays.Photo;
});