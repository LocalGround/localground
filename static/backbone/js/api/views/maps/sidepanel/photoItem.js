define(["views/maps/sidepanel/item"], function() {
    /** 
     * Class that controls photo Models. Extend the
     * {@link localground.maps.views.Item} class.
     * @class PhotoItem
     */
	localground.maps.views.PhotoItem = localground.maps.views.Item.extend({
		/**
		 * @lends localground.maps.views.PhotoItem#
		 */

		/**
		 * Creates a google.maps.Marker overlay with a photo icon
		 * if one doesn't already exist, and returns it.
		 * @returns {google.maps.Marker}
		 */
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
		
		/**
		 * Adds a marker to the map if isChecked == true,
		 * removes the marker otherwise. This function should
		 * probably be renamed.
		 * @param {Boolean} isChecked
		 * Flag that indicates whether or not the marker shoud
		 *
		 */
		showMarker: function(isChecked){
			//console.log("showMarker photoItem!");
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