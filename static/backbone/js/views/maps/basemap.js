define(["backbone", "lib/map/searchBox",
		"lib/map/geolocation", "lib/map/tileController"],
	function(Backbone) {
	/**
	 * A class that handles the basic Google Maps functionality,
	 * including tiles, search, and setting the default location.
	 * @class BasemapView
	 */
	localground.map.views.BasemapView = Backbone.View.extend({
		/**
		 * @lends localground.map.views.BasemapView#
		 */
		
		
		/** The google.maps.Map object */
		map: null,
		/** The default map type, if one is not specified */
		activeMapTypeID: 1,
		/** A boolean flag, indicating whether or not to
		 *  include a search control */
		searchControl: true,
		/** A boolean flag, indicating whether or not to
		 *  include a geolocation control */
		geolocationControl: false,
		/** localground.map.controls.TileController control */
		tileManager: null,
		/** A data structure containing user location preferences */
		userProfile: null,
		/** A data structure containing a default location */
		defaultLocation: null,
		/** An HTML Tag id where the map gets initialized */
		mapContainerID: null,
		
		/**
		 * Initializes the google map and it's corresponding controls,
		 * based on an "opts" configuration object. Valid options described
		 * below:
		 * @method
		 * @param {String} opts.mapContainerID
		 * @param {Object} opts.defaultLocation
		 * @param {Boolean} opts.searchControl
		 * @param {Boolean} opts.geolocationControl
		 * @param {Integer} opts.activeMapTypeID
		 * The user's preferred tileset for the given map.
		 * @param {Array} opts.overlays
		 * A list of available tilesets, based on user's profile.
		 */
		initialize: function(opts){
			$.extend(this, opts);
			
			//render map:
			this.renderMap();
			
			//add a search control, if requested:
			if (opts.searchControl)
				searchControl = new localground.map.controls.SearchBox(this.map);
			
			//add a browser-based location detector, if requested:
			if (this.geolocationControl) {
				geolocationControl = new localground.map.controls.GeoLocation({
					map: this.map,
					userProfile: this.userProfile,
					defaultLocation: this.defaultLocation
				});
			}
			
			if(this.overlays) {
				//set up the various map tiles in Google maps:
				tileController = new localground.map.controls.TileController({
					map: this.map,
					overlays: this.overlays,
					activeMapTypeID: this.activeMapTypeID
				})
			}
		},
		
		/**
		 * Helper method that initializes the Google map (before
		 * the corresponding controls are added).
		 */
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
	return localground.map.views.BasemapView;
});
