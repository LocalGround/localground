define([
		"views/maps/sidepanel/item",
		"lib/maps/geometry/point",
		"lib/maps/geometry/polyline"
		], function() {
    /** 
     * Class that controls photo Models. Extend the
     * {@link localground.maps.views.Item} class.
     * @class MarkerItem
     */
	localground.maps.views.MarkerItem = localground.maps.views.Item.extend({
		/**
		 * @lends localground.maps.views.MarkerItem#
		 */
		
		
		/**
		 * Creates a google.maps.Marker overlay with a photo icon
		 * if one doesn't already exist, and returns it.
		 * @returns {google.maps.Marker}
		 */
		getGoogleOverlay: function(){
			if (this.googleOverlay == null) {
				var geoJSON = this.model.get("geometry");
				switch (geoJSON.type) {
					case 'Point':
						this.googleOverlay = new google.maps.Marker({
							position: localground.maps.geometry.Polyline.getGoogleLatLng(geoJSON),
						});
						break;
					case 'LineString':
						console.log(geoJSON);
						this.googleOverlay = new google.maps.Polyline({
							path: localground.maps.geometry.Polyline.getGooglePath(geoJSON),
							strokeColor: this.model.get("color"),
							strokeOpacity: 1.0,
							strokeWeight: 5
						});
						console.log(this.googleOverlay);
						break;
					/*case 'Polygon':
						me.data.push(new localground.polygon(this)); 
						break;
					*/
					default:
						alert('Unknown Geometry Type');
				}
			}
			return this.googleOverlay;
		},
		
	})
	return localground.maps.views.MarkerItem;
});