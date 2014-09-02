define(["lib/maps/overlays/base"], function() {
    /** 
     * Class that controls photo model overlays.
     * Todo: make a google marker class that the Photo,
     * Audio, PointMarker, and Record class can consume 
     * @class Photo
     */
	localground.maps.overlays.Photo = localground.maps.overlays.Base.extend({
		/**
		 * Retrieve a photo map marker, depending on the map's zoom level
		 * @returns google.maps.MarkerImage
		 */
		getIcon: function() {
			if (this.map.getZoom() > 18) {
				return {
					url: this.model.get("path_small"),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(50, 0)
				};
			}
			else if (this.map.getZoom() > 16) {
				return {
					url: this.model.get("path_marker_lg"),	
					size: new google.maps.Size(52, 52),	
					origin: new google.maps.Point(0,0),	
					anchor: new google.maps.Point(26, 0)
				};
			}
			else {
				return {
					url: this.model.get("path_marker_sm"),	
					size: new google.maps.Size(20, 20),	
					origin: new google.maps.Point(0,0),	
					anchor: new google.maps.Point(10, 0)
				};
			}
		},
		
		/** adds icon to overlay. */
		initialize: function(sb, opts){
			localground.maps.overlays.Photo.__super__.initialize.apply(this, arguments); 
			this.getGoogleOverlay().setIcon(this.getIcon());
		},
		
		/** shows the google.maps overlay on the map. */
		show : function(){
			localground.maps.overlays.Photo.__super__.show.apply(this); 
			this.redraw();
		},
		redraw : function(){
			this.getGoogleOverlay().setIcon(this.getIcon());	
		}
	});
	return localground.maps.overlays.Photo;
});