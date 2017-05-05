define(["marionette", "underscore", "jquery", "collections/tilesets"],
    function (Marionette, _, $, TileSets) {
        "use strict";

        var TileController = Marionette.ItemView.extend({
            /**
             * Raw data array of map overlays, pulled from the Local Ground Data API.
             * @see <a href="//localground.org/api/0/tiles">Local Ground Data API</a>.
             */
            mapTypeIDs: [],
            mapTypes: {},
            initialize: function (opts) {
                _.extend(this, opts);
                this.tilesets = new TileSets();
                this.tilesets.fetch({ success: this.buildMapTypes.bind(this) });
                this.app.vent.on('map-tiles-changed', this.showCustomAttribution.bind(this));
            },
            initTiles: function () {
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
            },
            getTileSetByKey: function (key, value) {
                return this.tilesets.find(function (model) {
                    if (key === 'name') {
                        return model.get(key).toLowerCase() === value.toLowerCase();
                    }
                    return model.get(key) === value;
                });
            },
            buildMapTypes: function () {
                this.setActiveMapType(this.activeMapTypeID);
                this.initTiles();
            },
            getMapTypeId: function () {
                var tileset = this.getTileSetByKey("name", this.map.getMapTypeId().toLowerCase());
                if (!tileset) {
                    return null;
                }
                return tileset.id;
            },
            hideCustomAttribution: function () {
                $('.tile-attribution').parent().prev().show();
                $('.tile-attribution').remove();
            },
            showCustomAttribution: function (id) {
                this.hideCustomAttribution();
                id = id || this.getMapTypeId();
                var tileset = this.tilesets.get(id),
                    $message;
                if (!tileset.get("attribution")) {
                    return;
                }
                $message = $('<span class="tile-attribution"></span>').html(tileset.get("attribution"));
                $('.gm-style-cc span').parent().append($message);
                $message.css({
                    marginLeft: ($message.width() - 6) * -1,
                    backgroundColor: "rgba(255, 255, 255, 0.7)"
                });
                $message.parent().prev().hide();
            },
            setActiveMapType: function (id) {
                this.showCustomAttribution(id);
                var tileset = this.getTileSetByKey("id", id);
                if (tileset) {
                    this.map.setMapTypeId(tileset.getMapTypeID());
                    this.app.vent.trigger("map-tiles-changed");
                }
            }
        });


        return TileController;
    });
