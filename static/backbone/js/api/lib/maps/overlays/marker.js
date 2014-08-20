define([
		"lib/maps/overlays/point",
		"lib/maps/overlays/polyline",
		"lib/maps/overlays/polygon"
		], function() {
    /** 
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Overlay}.
     * @class Marker
     */
	localground.maps.overlays.Marker = function (opts) {
		
		/** Determine which overlay object Marker should extend */
		var geoJSON = opts.model.get("geometry");
		if (geoJSON.type == 'Point')
			localground.maps.overlays.Point.call(this, opts);
		else if (geoJSON.type == 'LineString')
			localground.maps.overlays.Polyline.call(this, opts);
		else if (geoJSON.type == 'Polygon')
			localground.maps.overlays.Polygon.call(this, opts);
		else
			alert('Unknown Geometry Type');
				
		/**
		 * Get the corresponding SVG marker icon
		 * @returns {Object} icon definition
		 */
		this.getIcon = function() {
			return {
				fillColor: this.model.get("color"),
				markerSize: 30,
				strokeColor: "#FFF",
				strokeWeight: 1.5,
				fillOpacity: 1,
				path: this.Shapes.MAP_PIN_HOLLOW,
				scale: 1.6
			};
		};
	};
	return localground.maps.overlays.Marker;
});