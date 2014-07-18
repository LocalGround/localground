define(["views/sidepanel/item"], function(ItemView) {
    var PhotoItemView = ItemView.extend({
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
		addMarker: function(e){
			var isChecked = $(e.currentTarget).prop('checked');
            var geom = this.model.get("geometry");
            if(isChecked && geom) {
                this.getGoogleOverlay().setMap(this.map);
				this.map.panTo(this.getGoogleLatLng());
            }
			else {
				if (this.googleOverlay) {
					this.getGoogleOverlay().setMap(null);
				}
			}
            e.stopPropagation();
        }	
	})
	return PhotoItemView;
});