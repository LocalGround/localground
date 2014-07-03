var Basemap = Backbone.View.extend({
	map: null,
	searchControl: null,
	userProfile: null,
	defaultLocation: null,
	render: function(opts){
		$.extend(this, opts);
		var mapOptions = {
			scrollwheel: false,
			minZoom: this.minZoom,
			streetViewControl: true,
			scaleControl: true,
			panControl: false,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position: google.maps.ControlPosition.TOP_LEFT
			},
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			},
			zoom: this.defaultLocation.zoom,
			center: this.defaultLocation.center
			
		};
		map = new google.maps.Map(opts.domElement, mapOptions);
		
		//add a search control, if requested:
		if (opts.searchControl) {
			searchControl = new localground.map.SearchBox();
		}
		
		//add a browser-based location detector, if requested:
		if (opts.geolocationControl) {
			geolocationControl = new localground.map.GeoLocation({
				map: map,
				userProfile: this.userProfile,
				defaultLocation: this.defaultLocation
			});
		}
	}
});
