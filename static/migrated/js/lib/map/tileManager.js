localground.map.TileManager = (function (opts) {
	var overlays = null;
	var map = null;
	var mapTypeIDs = [];
	var typeLookup = {
		stamen: localground.map.tiles.Stamen,
		mapbox: localground.map.tiles.MapBox,
	};
	
	this.setActiveMapType = function(id) {
		var mapType = getTileInfo("id", id);
		var sourceName = mapType.sourceName.toLowerCase();
		if (sourceName == "google") {
			map.setMapTypeId(mapType.providerID);
		}
		else {
			map.setMapTypeId(mapType.name);
		}
		
	};
	
	var setTiles = function(opts) {
		map = opts.map;
		overlays = opts.overlays;

		//iterate through each of the user's basemap tilesets and add it to the map:
		$.each(overlays, function() {
			var sourceName = this.sourceName.toLowerCase()
			if (sourceName == "stamen" || sourceName == "mapbox") {
				MapType = typeLookup[sourceName];
				mapTypeIDs.push(this.name);
				map.mapTypes.set(
					this.name,
					new MapType({
						styleID: this.providerID,
						name: this.name,
						max: this.max
					})
				);
			}
			else if (sourceName == "google") {
				mapTypeIDs.unshift(this.providerID);
			}
			else {
				alert("Error in localground.map.TileManager: unknown map type");
			}
		});
        map.mapTypeControlOptions.mapTypeIds = mapTypeIDs;
    }

	var getTileInfo = function(key, value){
		for(var i=0; i < overlays.length; i++) {
			if(value.toString().toLowerCase() == overlays[i][key].toString().toLowerCase()) {
				return overlays[i];
			}
		}
		return null;
	}
	
	var getMapTypeNamebyId = function(id) {
		var tileInfo = getTileInfo("id", id);
		return tileInfo.name;
	};
	
	var getMapTypeId = function() {
		var tileInfo = getTileInfo("name", map.getMapTypeId().toLowerCase());
		return tileInfo.id;
	};

	// initialize:
	setTiles(opts);
	
});
