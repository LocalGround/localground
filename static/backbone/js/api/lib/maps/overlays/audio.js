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
				scale: 1.6
			};
		};
	};
	return localground.maps.overlays.Audio;
});