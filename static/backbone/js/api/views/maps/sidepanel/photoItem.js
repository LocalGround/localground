define(["views/maps/sidepanel/item"], function() {
    /** 
     * Class that controls the right-hand listing of a single
     * Backbone Model.
     * @class PhotoItem
     */
	localground.maps.views.PhotoItem = localground.maps.views.Item.extend({
		/**
		 * @lends localground.maps.views.PhotoItem#
		 */
		
		googleOverlay: null,
		getGoogleOverlay: function(){
			if (this.googleOverlay == null) {
				this.googleOverlay = new google.maps.Marker({
					position: this.getGoogleLatLng()
				});
				if (this.model.get("path_marker_sm")) {
					this.googleOverlay.setIcon(new google.maps.MarkerImage(
						this.model.get("path_marker_sm"),
						new google.maps.Size(20, 20),	// size (width, height)
						new google.maps.Point(0,0),		// origin (x, y)
						new google.maps.Point(10, 10)	// anchor (x, y)
					));
				}
			}
			return this.googleOverlay;
		},
		addMarker: function(isChecked){
			console.log("addMarker photoItem!");
			var geom = this.model.get("geometry");
			console.log(geom);
            if(isChecked && geom) {
                this.getGoogleOverlay().setMap(this.map);
				this.map.panTo(this.getGoogleLatLng());
            }
			else {
				if (this.googleOverlay) {
					this.getGoogleOverlay().setMap(null);
				}
			}
        }	
	})
	return localground.maps.views.PhotoItem;
});