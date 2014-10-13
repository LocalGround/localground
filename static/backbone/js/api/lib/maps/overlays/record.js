define(["lib/maps/overlays/base"], function() {
    /** 
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
	localground.maps.overlays.Record = localground.maps.overlays.Base.extend({

		/**
		 * Get the corresponding SVG marker icon
		 * @returns {Object} icon definition
		 */
		getIcon: function() {
			return {
				fillColor: "#CCC",
				markerSize: 30,
				strokeColor: "#FFF",
				strokeWeight: 1.5,
				fillOpacity: 1,
				path: this.overlay.Shapes.MAP_PIN_HOLLOW,
				scale: 1.6,
				anchor: new google.maps.Point(16,30), 		// anchor (x, y)
				size: new google.maps.Size(15, 30),			// size (width, height)
				origin: new google.maps.Point(0,0)			// origin (x, y)
			};
		},
		
		/** adds icon to overlay. */
		initialize: function(sb, opts){
			localground.maps.overlays.Record.__super__.initialize.apply(this, arguments); 
			this.redraw();
		},
		
		/** shows the google.maps overlay on the map. */
		show : function(){
			localground.maps.overlays.Record.__super__.show.apply(this); 
			this.redraw();
		},
		
		redraw : function(){
			this.overlay.setIcon(this.getIcon());	
		}
	});
	return localground.maps.overlays.Record;
});