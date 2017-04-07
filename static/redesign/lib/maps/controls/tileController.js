define(["jquery", "collections/tilesets", "lib/maps/tiles/mapbox", "lib/maps/tiles/stamen"],
    function ($, TileSets, MapBox, Stamen) {
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
            this.mapTypeIDs = [];
            this.initialize = function (app, opts) {
                this.app = app;
                this.map = opts.map;
                this.activeMapTypeID = opts.activeMapTypeID;
                this.tilesets = new TileSets();
                this.tilesets.fetch({ success: this.buildMapTypes.bind(this) });
            };

            /** Lookup table of non-Google tile managers */
            this.typeLookup = {
                stamen: Stamen,
                mapbox: MapBox
            };

            this.initTiles = function () {
                //iterate through each of the user's basemap tilesets and add it to the map:
                var that = this;
                this.tilesets.each(function (tileset) {
                    var sourceName = tileset.get("source_name").toLowerCase(),
                        MapType,
                        name = tileset.get("name"),
                        base_tile_url = tileset.get("base_tile_url"),
                        maxZoom = tileset.get("max_zoom"),
                        clientStyles = tileset.get("extras") ? tileset.get("extras").clientStyles : null;
                    if (sourceName === "stamen" || sourceName === "mapbox") {
                        MapType = that.typeLookup[sourceName];
                        that.mapTypeIDs.push(name);
                        that.map.mapTypes.set(
                            name,
                            new MapType({
                                url: base_tile_url,
                                styleID: name.toLowerCase(),
                                max: maxZoom,
                                name: name
                            })
                        );
                    } else if (sourceName === "google" && !clientStyles) {
                        that.mapTypeIDs.unshift(name.toLowerCase());
                    } else if (clientStyles) {
                        that.map.mapTypes.set(name,
                            new google.maps.StyledMapType(clientStyles, { name: name }));
                        that.mapTypeIDs.unshift(name);
                    } else {
                        alert("Error in localground.maps.TileManager: unknown map type: " + sourceName);
                    }
                });

                if (this.map.mapTypeControlOptions) {
                    console.log(this.mapTypeIDs);
                    this.map.mapTypeControlOptions.mapTypeIds = this.mapTypeIDs;
                }
            };

            this.getTileInfo = function (key, value) {
                return this.tilesets.find(function (model) {
                    if (key === 'name') {
                        return model.get(key).toLowerCase() === value.toLowerCase();
                    }
                    return model.get(key) === value;
                });
            };

            this.buildMapTypes = function () {
                //console.log(this.tilesets);

                //initialize tiles and set the active map type
                this.initTiles();
                this.setActiveMapType(this.activeMapTypeID);
                this.app.vent.on('set-map-type', this.setActiveMapType.bind(this));
            };

            this.getMapTypeNamebyId = function (id) {
                var tileInfo = this.getTileInfo("id", id);
                return tileInfo.get("name");
            };

            this.getMapTypeId = function () {
                //alert(this.map.getMapTypeId().toLowerCase());
                var tileset = this.getTileInfo("name", this.map.getMapTypeId().toLowerCase());
                if (!tileset) {
                    return null;
                }
                return tileset.id;
            };

            this.setActiveMapType = function (id) {
                if (!id) {
                    return;
                }
                var tileset = this.getTileInfo("id", id),
                    sourceName = null,
                    mapTypeID = null;
                if (tileset) {
                    sourceName = tileset.get("source_name").toLowerCase();
                    mapTypeID = tileset.get("name");
                    if (sourceName === "google" && !tileset.get("extras")) {
                        mapTypeID = tileset.get("name").toLowerCase();
                    }
                    console.log(mapTypeID);
                    this.map.setMapTypeId(mapTypeID);
                    this.app.vent.trigger("map-tiles-changed");
                }
            };


            // call on initialization:
            this.initialize(app, opts);
        };


        return TileController;
    });
