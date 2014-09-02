define([
		"lib/maps/overlays/base"
		], function() {
    /** 
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Overlay}.
     * @class Marker
     */
	localground.maps.overlays.Marker = localground.maps.overlays.Base.extend({
				
		/**
		 * Get the corresponding SVG marker icon
		 * @returns {Object} icon definition
		 */
		getIcon: function() {
			//return null;
			return {
				fillColor: '#' + this.model.get("color"),
				//markerSize: 30,
				strokeColor: "#FFF",
				strokeWeight: 1.5,
				fillOpacity: 1,
				path: this.overlay.Shapes.MAP_PIN_HOLLOW,
				scale: 1.6,
				anchor: new google.maps.Point(16,5), 		// anchor (x, y)
				//size: new google.maps.Size(?, ?),			// size (width, height)
				//origin: new google.maps.Point(?, ?)		// origin (x, y)
			};
		},
		
		/** adds icon to overlay. */
		initialize: function(sb, opts){
			localground.maps.overlays.Marker.__super__.initialize.apply(this, arguments); 
			if(this.overlay.getType() == "Point")
			   this.getGoogleOverlay().setIcon(this.getIcon());
		},
		
		/** shows the google.maps overlay on the map. */
		show : function(){
			localground.maps.overlays.Marker.__super__.show.apply(this); 
			this.redraw();
		},
		
		redraw : function(){
			if(this.overlay.getType() == "Point")
				this.getGoogleOverlay().setIcon(this.getIcon());
			else
				this.overlay.redraw();
		}
		
		
	});
	return localground.maps.overlays.Marker;
});