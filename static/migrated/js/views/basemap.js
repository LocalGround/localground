var Basemap = Backbone.View.extend({
	// available objects:
	map: null,
	activeMapTypeID: 1,
	searchControl: null,
	geolocationControl: null,
	tileManager: null,
	userProfile: null,
	defaultLocation: null,
	
	//functions:
	render: function(opts){
		alert(JSON.stringify(opts.mapContainerID));
		$.extend(this, opts);
		
		//render map:
		this.renderMap(opts.mapContainerID);
		
		//add a search control, if requested:
		if (opts.searchControl) {
			searchControl = new localground.map.SearchBox();
		}
		
		//add a browser-based location detector, if requested:
		if (this.geolocationControl) {
			geolocationControl = new localground.map.GeoLocation({
				map: map,
				userProfile: this.userProfile,
				defaultLocation: this.defaultLocation
			});
		}
		
		//set up the various map tiles in Google maps:
		tileManager = new localground.map.TileManager({
			map: map,
			overlays: this.overlays,
			activeMapTypeID: this.activeMapTypeID
		})
	},
	
	renderMap: function(mapContainerID){
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
			styles: [{
				featureType: "poi.school",
				elementType: "geometry", 
				stylers: [ { saturation: -79 }, { lightness: 75 } ]
			}],
			zoom: this.defaultLocation.zoom,
			center: this.defaultLocation.center
			
		};
		map = new google.maps.Map(document.getElementById(mapContainerID),
									mapOptions);
	}
});
