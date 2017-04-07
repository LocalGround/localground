define(["collections/tilesets", "lib/maps/tiles/mapbox", "lib/maps/tiles/stamen"],
    function (TileSets, MapBox, Stamen) {
        "use strict";

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
                this.showDropdown = opts.showDropdown || false;
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
                        clientStyles = tileset.getClientStyles();
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
                    } else if (sourceName === "google" && !tileset.isCustom()) {
                        that.mapTypeIDs.unshift(name.toLowerCase());
                    } else if (clientStyles) {
                        that.map.mapTypes.set(name,
                            new google.maps.StyledMapType(clientStyles, { name: name }));
                        that.mapTypeIDs.unshift(name);
                    } else {
                        alert("Error in localground.maps.TileManager: unknown map type: " + sourceName);
                    }
                });

                //only show map dropdown once tilesets loaded:
                if (this.showDropdown) {
                    this.map.setOptions({
                        mapTypeControlOptions: {
                            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                            position: google.maps.ControlPosition.TOP_LEFT,
                            mapTypeIds: this.mapTypeIDs
                        },
                        mapTypeControl: true
                    });
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
                this.setActiveMapType(this.activeMapTypeID);
                this.initTiles();
            };

            this.getMapTypeNamebyId = function (id) {
                var tileInfo = this.getTileInfo("id", id);
                return tileInfo.get("name");
            };

            this.getMapTypeId = function () {
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
                    if (sourceName === "google" && !tileset.isCustom()) {
                        mapTypeID = tileset.get("name").toLowerCase();
                    }
                    this.map.setMapTypeId(mapTypeID);
                    this.app.vent.trigger("map-tiles-changed");
                }
            };

            // call on initialization:
            this.initialize(app, opts);
        };


        return TileController;
    });
