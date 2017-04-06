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
            var url = '//' + ['', 'a.', 'b.'][parseInt(Math.random() * 3, 10)] + 'api.mapbox.com/styles/v1/mapbox/';
            return $('<div></div>').css({
                'width': '256px',
                'height': '256px',
                'backgroundImage': 'url(' + url + this.styleID + '/tiles/256/' + zoom + '/' +
                    coord.x + '/' + coord.y + '?access_token=' + MAPBOX_API_KEY + ')'

            }).get(0);
        };
    };
    return MapBox;
});