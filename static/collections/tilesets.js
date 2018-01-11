define(["underscore", "models/tileset", "collections/base"], function (_, TileSet, Base) {
    "use strict";
    var TileSets = Base.extend({
        model: TileSet,
        name: 'Tilesets',
        key: 'tilesets',
        url: '/api/0/tiles/',
        mapTypes: {},
        mapTypeIDs: [],
        initialize: function (recs, opts) {
            _.extend(this, opts);
            this.on('reset', this.initTiles);
            //this.initTiles();
            Base.prototype.initialize.apply(this, arguments);
        },
        getMapTypeId: function (map) {
            var tileset = this.getTileSetByKey("name", map.getMapTypeId().toLowerCase());
            if (!tileset) {
                return null;
            }
            return tileset.id;
        },
        initTiles: function () {
            try {
                if (google === 'undefined') { return; }
            } catch (e) { return; }
            //iterate through each of the user's basemap tilesets and add it to the map:
            var that = this;
            this.each(function (tileset) {
                var sourceName = tileset.get("source_name").toLowerCase(),
                    mapTypeID = tileset.getMapTypeID();
                switch (sourceName) {
                case "stamen":
                case "cooper center":
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
        }
    });
    return TileSets;
});
