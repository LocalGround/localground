var Basemap = Backbone.View.extend({
	map: null,
	activeMapTypeID: 1,
	searchControl: null,
	geolocationControl: null,
	tileManager: null,
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
			styles: [{
				featureType: "poi.school",
				elementType: "geometry", 
				stylers: [ { saturation: -79 }, { lightness: 75 } ]
			}],
			zoom: this.defaultLocation.zoom,
			center: this.defaultLocation.center
			
		};
		map = new google.maps.Map(opts.domElement, mapOptions);
		
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
		
		tileManager = new localground.map.TileManager({
			map: map,
			overlays: [{"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "lg.i1p5alka", "id": 1, "typeID": 1, "name": "Mapnik", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"}, {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "roadmap", "id": 2, "typeID": 1, "name": "Roadmap", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=roadmap&style=feature:poi.school|element:geometry|saturation:-79|lightness:75", "sourceID": 5, "type": "Base Tileset"}, {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "hybrid", "id": 3, "typeID": 1, "name": "Hybrid", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=hybrid", "sourceID": 5, "type": "Base Tileset"}, {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "terrain", "id": 4, "typeID": 1, "name": "Terrain", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=terrain", "sourceID": 5, "type": "Base Tileset"}, {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "satellite", "id": 9, "typeID": 1, "name": "Satellite", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=satellite", "sourceID": 5, "type": "Base Tileset"}, {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "lg.i1p2e2cf", "id": 12, "typeID": 1, "name": "Grayscale", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"}, {"sourceName": "stamen", "max": 20, "is_printable": false, "providerID": "watercolor", "id": 20, "typeID": 1, "name": "Watercolor", "min": 1, "url": "", "sourceID": 6, "type": "Base Tileset"}]
		})
		tileManager.setActiveMapType(this.activeMapTypeID);
	}
});
