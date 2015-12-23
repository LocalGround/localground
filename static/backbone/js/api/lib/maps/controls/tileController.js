define(["lib/maps/tiles/mapbox", "lib/maps/tiles/stamen", "jquery"],
    function (MapBox, Stamen, $) {
        "use strict";
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
        var TileController = function (app, opts) {
            /**
             * Raw data array of map overlays, pulled from the Local Ground Data API.
             * @see <a href="//localground.org/api/0/tiles">Local Ground Data API</a>.
             */
            this.tilesets = null;
            this.app = app;
            var that = this,

                /**
                 * A google.maps.Map object
                 * @see <a href="https://developers.google.com/maps/documentation/javascript/reference#Map">Google Maps API</a>.
                 */
                map = null,

                /** @field {Array} A list of map Ids */
                mapTypeIDs = [],

                /** Lookup table of non-Google tile managers */
                typeLookup = {
                    stamen: Stamen,
                    mapbox: MapBox
                },
                /**
                 * Initializes the tilesets for the map and adds each
                 * tileset option to the maptype control on the map.
                 * @method
                 *
                 */
                initTiles = function () {
                    //iterate through each of the user's basemap tilesets and add it to the map:
                    $.each(this.tilesets, function () {
                        var sourceName = this.sourceName.toLowerCase();
                        if (sourceName === "stamen" || sourceName === "mapbox") {
                            var MapType = typeLookup[sourceName];
                            mapTypeIDs.push(this.name);
                            map.mapTypes.set(
                                this.name,
                                new MapType({
                                    styleID: this.providerID,
                                    name: this.name,
                                    max: this.max
                                })
                            );
                        } else if (sourceName === "google") {
                            mapTypeIDs.unshift(this.providerID);
                        } else {
                            alert("Error in localground.maps.TileManager: unknown map type: " + sourceName);
                        }
                    });
                    if (map.mapTypeControlOptions) {
                        //map controls may or may not be activated (but tiles still need to be initialized)
                        map.mapTypeControlOptions.mapTypeIds = mapTypeIDs;
                    }
                }.bind(this), /**
                 * @method
                 * Gets the tile information according to the key/value identifier.
                 */
                getTileInfo = function (key, value) {
                    var i = 0;
                    for (i; i < this.tilesets.length; i++) {
                        if (value.toString().toLowerCase() === this.tilesets[i][key].toString().toLowerCase()) {
                            return this.tilesets[i];
                        }
                    }
                    return null;
                }.bind(this),

                /**
                 * Initializes the TileController
                 * @method initialize
                 *
                 * @param {google.maps.Map} opts.map
                 * A google.maps.Map object, to which the TileController
                 * should be attached.
                 *
                 * @param {Array} opts.tilesets
                 * A list of available tilesets, retrieved from the Local Ground API.
                 *
                 * @param {Integer} opts.activeMapTypeID
                 * The tileset that should be initialized on startup.
                 */
                initialize = function (opts) {
                    //initialize properties:
                    this.tilesets = opts.tilesets;
                    map = opts.map;

                    //initialize tiles and set the active map type
                    initTiles();
                    that.setActiveMapType(opts.activeMapTypeID);
                    this.app.vent.on('set-map-type', this.setActiveMapType.bind(this));

                }.bind(this);


            /**
             * Gets the name of the tileset by the ID.
             * @method getMapTypeNamebyId
             *
             * @param {Integer} id
             * The id of the tileset.
             * @returns {String}
             */
            this.getMapTypeNamebyId = function (id) {
                var tileInfo = getTileInfo("id", id);
                return tileInfo.name;
            };

            /**
             * Gets the tile information by the id.
             * @method getMapTypeId
             * @returns {Integer}
             */
            this.getMapTypeId = function () {
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
            this.setActiveMapType = function (id) {
                if (!id) {
                    return;
                }
                var mapType = getTileInfo("id", id),
                    sourceName = null,
                    mapTypeID = null;
                if (mapType) {
                    sourceName = mapType.sourceName.toLowerCase();
                    mapTypeID = mapType.name;
                    if (sourceName === "google") {
                        mapTypeID = mapType.providerID;
                    }
                    map.setMapTypeId(mapTypeID);
                    this.app.vent.trigger("map-tiles-changed");
                }
            };


            // call on initialization:
            initialize(opts);
        };


        return TileController;
    });
