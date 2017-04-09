define(["collections/tilesets"],
    function (TileSets) {
        "use strict";

        var TileController = function (app, opts) {
            /**
             * Raw data array of map overlays, pulled from the Local Ground Data API.
             * @see <a href="//localground.org/api/0/tiles">Local Ground Data API</a>.
             */
            this.mapTypeIDs = [];
            this.mapTypes = {};
            this.initialize = function (app, opts) {
                this.app = app;
                this.map = opts.map;
                this.activeMapTypeID = opts.activeMapTypeID;
                this.tilesets = new TileSets();
                this.tilesets.fetch({ success: this.buildMapTypes.bind(this) });
            };

            this.initTiles = function () {
                //iterate through each of the user's basemap tilesets and add it to the map:
                var that = this;
                this.tilesets.each(function (tileset) {
                    var sourceName = tileset.get("source_name").toLowerCase(),
                        mapTypeID = tileset.getMapTypeID();
                    switch (sourceName) {
                    case "stamen":
                    case "mapbox":
                        that.mapTypes[mapTypeID] = tileset.getMapType();
                        that.mapTypeIDs.push(mapTypeID);
                        break;
                    case "google":
                        if (tileset.isCustom()) {
                            that.mapTypes[mapTypeID] = that.mapTypes[mapTypeID] = tileset.getMapType();
                        }
                        that.mapTypeIDs.unshift(mapTypeID);
                        break;
                    case "default":
                        alert("Error in localground.maps.TileManager: unknown map type: " + sourceName);
                        break;
                    }
                });
                this.app.vent.trigger('tiles-loaded', {
                    mapTypeIDs: this.mapTypeIDs,
                    mapTypes: this.mapTypes
                });
            };

            this.getTileSetByKey = function (key, value) {
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

            this.getMapTypeId = function () {
                var tileset = this.getTileSetByKey("name", this.map.getMapTypeId().toLowerCase());
                if (!tileset) {
                    return null;
                }
                return tileset.id;
            };

            this.setActiveMapType = function (id) {
                if (!id) {
                    return;
                }
                var tileset = this.getTileSetByKey("id", id);
                if (tileset) {
                    this.map.setMapTypeId(tileset.getMapTypeID());
                    this.app.vent.trigger("map-tiles-changed");
                }
            };

            // call on initialization:
            this.initialize(app, opts);
        };


        return TileController;
    });
