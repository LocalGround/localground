define(["models/base", "lib/maps/tiles/mapbox", "lib/maps/tiles/stamen", "lib/maps/tiles/virginia-dotmap"],
    function (Base, MapBox, Stamen, VirginiaDotMap) {
        "use strict";
        var TileSet = Base.extend({
            getClientStyles: function () {
                return this.get("extras") ? this.get("extras").clientStyles : null;
            },
            isCustom: function () {
                return this.getClientStyles() !== null;
            },
            getMapTypeID: function () {
                var sourceName = this.get("source_name").toLowerCase(),
                    mapTypeID = this.get("name");
                if (sourceName === "google" && !this.isCustom()) {
                    mapTypeID = mapTypeID.toLowerCase();
                }
                return mapTypeID;
            },
            getMapType: function () {
                var sourceName = this.get("source_name").toLowerCase();
                switch (sourceName) {
                case "stamen":
                    return new Stamen({
                        url: this.get("base_tile_url"),
                        max: this.get("max_zoom"),
                        name: this.getMapTypeID()
                    });
                case "mapbox":
                    return new MapBox({
                        url: this.get("base_tile_url"),
                        max: this.get("max_zoom"),
                        name: this.getMapTypeID()
                    });
                case "cooper center":
                    var that = this;
                    return new google.maps.ImageMapType({
                        getTileUrl: function (coord, zoom) {
                            var url = that.get("base_tile_url").split('{z}')[0];
                            return url + zoom + '/' + coord.x + '/' + coord.y + '.png';
                        },
                        tileSize: new google.maps.Size(256, 256),
                        maxZoom: this.get("max_zoom"),
                        minZoom: this.get("min_zoom"),
                        name: this.getMapTypeID()
                    });
                case "google":
                    if (this.isCustom()) {
                        return new google.maps.StyledMapType(
                            this.getClientStyles(),
                            { name: this.getMapTypeID() }
                        );
                    }
                    return null;
                }
                return null;
            }
        });
        return TileSet;
    });
