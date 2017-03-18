define(["jquery"], function ($) {
    "use strict";
    /**
     * Class that initializes a MapBox tileset.
     * @class MapBox
     * @param opts Initialization options for the Stamen class.
     * @param {Integer} opts.max
     * The maximum valid zoom level for the tileset.
     * @param {Integer} opts.styleID
     * The corresponding style ID associated with the tileset.
     * @param {String} name
     * The name of the tileset.
     */
    var MapBox = function (opts) {
        this.styleID = 1;
        this.maxZoom = opts.max;
        this.styleID = opts.styleID;
        this.name = opts.name;
        this.tileSize = new google.maps.Size(256, 256);
        this.getTile = function (coord, zoom, ownerDocument) {
            var url = '//' + ['a.', 'b.', 'c.', 'd.'][parseInt(Math.random() * 4, 10)] + 'tiles.mapbox.com/v3/';
            return $('<div></div>').css({
                'width': '256px',
                'height': '256px',
                'backgroundImage': 'url(' + url + this.styleID + '/' + zoom + '/' +
                    coord.x + '/' + coord.y + '.png)'

            }).get(0);
        };
    };
    return MapBox;
});