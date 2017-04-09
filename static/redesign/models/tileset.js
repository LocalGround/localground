define(["models/base", "lib/maps/tiles/mapbox", "lib/maps/tiles/stamen"],
    function (Base, MapBox, Stamen) {
        "use strict";
        var TileSet = Base.extend({
            getNamePlural: function () {
                return "tilesets";
            },
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
