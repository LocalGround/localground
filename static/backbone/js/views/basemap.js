define(["backbone", "lib/map/searchBox",
		"lib/map/geolocation", "lib/map/tileController"],
	   function(Backbone, SearchBox, GeoLocation, TileController) {
	
	var BasemapView = Backbone.View.extend({
		// available objects:
		map: null,
		activeMapTypeID: 1,
		searchControl: null,
		geolocationControl: null,
		tileManager: null,
		userProfile: null,
		defaultLocation: null,
		mapContainerID: null,
		
		//functions:
		initialize: function(opts){
			$.extend(this, opts);
			
			//render map:
			this.renderMap();
			
			//add a search control, if requested:
			if (opts.searchControl)
				searchControl = new SearchBox({ map: this.map });
			
			//add a browser-based location detector, if requested:
			if (this.geolocationControl) {
				geolocationControl = new GeoLocation({
					map: this.map,
					userProfile: this.userProfile,
					defaultLocation: this.defaultLocation
				});
			}
			
			if(this.overlays) {
				//set up the various map tiles in Google maps:
				tileController = new TileController({
					map: this.map,
					overlays: this.overlays,
					activeMapTypeID: this.activeMapTypeID
				})
			}
		},
		
		renderMap: function(){
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
			this.map = new google.maps.Map(document.getElementById(this.mapContainerID),
										mapOptions);
			
		}
	});
	return BasemapView;
});
