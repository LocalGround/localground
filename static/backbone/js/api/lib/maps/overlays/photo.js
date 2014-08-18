define(["lib/maps/overlays/point"], function() {
    /** 
     * Class that controls photo model overlays.
     * Todo: make a google marker class that the Photo,
     * Audio, PointMarker, and Record class can consume 
     * @class Photo
     */
	localground.maps.overlays.Photo = function (opts) {
		
		localground.maps.overlays.Point.call(this, opts);
		
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
	};
	return localground.maps.overlays.Photo;
});