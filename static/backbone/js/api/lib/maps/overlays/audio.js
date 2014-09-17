define(["lib/maps/overlays/base"], function() {
    /** 
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
	localground.maps.overlays.Audio = localground.maps.overlays.Base.extend({

		/**
		 * Get the corresponding SVG marker icon
		 * @returns {Object} icon definition
		 */
		getIcon: function() {
			return {
				fillColor: "#333",
				markerSize: 30,
				strokeColor: "#FFF",
				strokeWeight: 1.5,
				fillOpacity: 1,
				path: this.overlay.Shapes.SOUND,
				anchor: new google.maps.Point(16,5), 
				scale: 1.6
			};
		},
		
		/** adds icon to overlay. */
		initialize: function(sb, opts){
			localground.maps.overlays.Audio.__super__.initialize.apply(this, arguments); 
			this.redraw();
		},
		
		/** shows the google.maps overlay on the map. */
		show : function(){
			localground.maps.overlays.Audio.__super__.show.apply(this); 
			this.redraw();
		},
		
		redraw : function(){
			this.overlay.setIcon(this.getIcon());	
		}
	});
	return localground.maps.overlays.Audio;
});