define(["lib/map/tiles/mapbox", "lib/map/tiles/stamen"],
	function() {
	/** 
     * Class that controls the map's tile options.
     * @class TileController
     * @param {google.maps.Map} opts.map
     * A google.maps.Map object, to which the TileController
     * should be attached.
     * 
     * @param {Array} opts.overlays
     * A list of available overlays, retrieved from the Local Ground API.
     * 
     * @param {Integer} opts.activeMapTypeID
     * The tileset that should be initialized on startup.
     */
	localground.controls.TileController = (function (opts) {
		var that = this;
		var overlays = null;
		var map = null;
		var mapTypeIDs = [];
		var typeLookup = {
			stamen: localground.tiles.Stamen,
			mapbox: localground.tiles.MapBox,
		};
		
		/**
		 * @method
		 * Initializes the tilesets for the map.
		 */
		var initTiles = function() {
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
	
		/**
		 * @method
		 * Gets the tile information according to the key/value identifier.
		 */
		var getTileInfo = function(key, value){
			for(var i=0; i < overlays.length; i++) {
				if(value.toString().toLowerCase() == overlays[i][key].toString().toLowerCase()) {
					return overlays[i];
				}
			}
			return null;
		}
		
		/**
		 * @method
		 * Gets the tile information by the id.
		 */
		localground.controls.TileController.prototype.getMapTypeNamebyId = function(id) {
			var tileInfo = getTileInfo("id", id);
			return tileInfo.name;
		};
		
		/**
		 * @method
		 * Gets the tile information by the id.
		 */
		localground.controls.TileController.prototype.getMapTypeId = function() {
			var tileInfo = getTileInfo("name", map.getMapTypeId().toLowerCase());
			return tileInfo.id;
		};
	
		/**
		 * @method
		 * Initializes the TileController
		 * 
		 * @param {google.maps.Map} opts.map
		 * A google.maps.Map object, to which the TileController
     	 * should be attached.
     	 * 
     	 * @param {Array} opts.overlays
     	 * A list of available overlays, retrieved from the Local Ground API.
     	 * 
     	 * @param {Integer} opts.activeMapTypeID
     	 * The tileset that should be initialized on startup.
     	 */
		var initialize = function(opts) {
			//initialize properties:
			overlays = opts.overlays;
			map = opts.map;
			
			//initialize tiles and set the active map type
			initTiles();
			that.setActiveMapType(opts.activeMapTypeID);
		};
		
		/**
		* @method
		* Sets the active basemap tileset on the map. Called
		* from the HTML control.
		* @param {Integer} id
		* The id of the corresponding tileset.
		*/
		localground.controls.TileController.prototype.setActiveMapType = function(id) {
			if (id == null) {
				return;
			}
			var mapType = getTileInfo("id", id);
			var sourceName = mapType.sourceName.toLowerCase();
			if (sourceName == "google") {
				map.setMapTypeId(mapType.providerID);
			}
			else {
				map.setMapTypeId(mapType.name);
			}
	   };
	
		// call on initialization:
		initialize(opts);
	});
	
	
	return localground.controls.TileController;
});
