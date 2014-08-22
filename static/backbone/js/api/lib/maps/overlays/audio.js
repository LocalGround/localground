define(["lib/maps/overlays/point"], function() {
    /** 
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
	localground.maps.overlays.Audio = function (opts) {

		localground.maps.overlays.Point.call(this, opts);
		
		/**
		 * Get the corresponding SVG marker icon
		 * @returns {Object} icon definition
		 */
		this.getIcon = function() {
			return {
				fillColor: "#333",
				markerSize: 30,
				strokeColor: "#FFF",
				strokeWeight: 1.5,
				fillOpacity: 1,
				path: this.Shapes.SOUND,
				anchor: new google.maps.Point(16,5), 
				scale: 1.6
			};
		};

		this.initialize();
	};
	return localground.maps.overlays.Audio;
});