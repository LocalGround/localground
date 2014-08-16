define(["lib/maps/tiles/mapbox", "lib/maps/tiles/stamen"],
	function() {
	/** 
     * Class that controls the map's tile options.
     * @class TileController
     * @param {google.maps.Map} opts.map
     * A google.maps.Map object, to which the TileController
     * should be attached.
     * 
     * @param {Array} opts.overlays
     * A list of available overlays, retrieved from the Local Ground Data API.
     * 
     * @param {Integer} opts.activeMapTypeID
     * The tileset that should be initialized on startup.
     */
	localground.maps.controls.TileController = function(opts) {
		var that = this;
		/**
		 * Raw data array of map overlays, pulled from the Local Ground Data API.
		 * @see <a href="http://localground.org/api/0/tiles">Local Ground Data API</a>.
		 */
		this.overlays = null;
		
		/**
		 * A google.maps.Map object
		 * @see <a href="https://developers.google.com/maps/documentation/javascript/reference#Map">Google Maps API</a>.
		 */
		var map = null;
		
		/** @field {Array} A list of map Ids */
		var mapTypeIDs = [];
		
		/** Lookup table of non-Google tile managers */
		var typeLookup = {
			stamen: localground.maps.tiles.Stamen,
			mapbox: localground.maps.tiles.MapBox,
		};
		
		/**
		 * Gets the name of the tileset by the ID.
		 * @method getMapTypeNamebyId
		 * 
		 * @param {Integer} id
		 * The id of the tileset.
		 * @returns {String}
		 */
		this.getMapTypeNamebyId = function(id) {
			var tileInfo = getTileInfo("id", id);
			return tileInfo.name;
		};
		
		/**
		 * Gets the tile information by the id.
		 * @method getMapTypeId
		 * @returns {Integer}
		 */
		this.getMapTypeId = function() {
			var tileInfo = getTileInfo("name", map.getMapTypeId().toLowerCase());
			return tileInfo.id;
		};
		
		/**
		* Sets the active basemap tileset on the map. Called
		* from the HTML control.
		* @method setActiveMapType
		* 
		* @param {Integer} id
		* The id of the corresponding tileset.
		*/
		this.setActiveMapType = function(id) {
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
		
		
		/**
		 * Initializes the tilesets for the map and adds each
		 * tileset option to the maptype control on the map.
		 * @method
		 * 
		 */
		var initTiles = function() {
			//iterate through each of the user's basemap tilesets and add it to the map:
			$.each(this.overlays, function() {
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
					alert("Error in localground.maps.TileManager: unknown map type");
				}
			});
			map.mapTypeControlOptions.mapTypeIds = mapTypeIDs;
		}
	
		/**
		 * @method
		 * Gets the tile information according to the key/value identifier.
		 */
		var getTileInfo = function(key, value){
			for(var i=0; i < this.overlays.length; i++) {
				if(value.toString().toLowerCase() == this.overlays[i][key].toString().toLowerCase()) {
					return this.overlays[i];
				}
			}
			return null;
		}
	
		/**
		 * Initializes the TileController
		 * @method initialize
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
			this.overlays = opts.overlays;
			map = opts.map;
			
			//initialize tiles and set the active map type
			initTiles();
			that.setActiveMapType(opts.activeMapTypeID);
		};
	
		// call on initialization:
		initialize(opts);
	};
	
	
	return localground.maps.controls.TileController;
});
