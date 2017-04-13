define(["jquery"], function ($) {
    "use strict";
    var MapBox = function (opts) {
        /*
         * https://api.mapbox.com/styles/v1/lg/cj176x4e400252sk86yda5omv/tiles/256/{z}/{x}/{y}
         */
        //this.id = opts.styleID;
        this.maxZoom = opts.max;
        this.name = opts.name;
        this.url = opts.url.split('{z}')[0].split('//')[1];
        this.tileSize = new google.maps.Size(256, 256);
        this.getTile = function (coord, zoom) {
            var url = '//' + ['', 'a.', 'b.'][parseInt(Math.random() * 3, 10)] + this.url;
            return $('<div></div>').css({
                'width': '256px',
                'height': '256px',
                'backgroundImage': 'url(' + url + zoom + '/' +
                    coord.x + '/' + coord.y + '?access_token=' + MAPBOX_API_KEY + ')'
            }).get(0);
        };

    };
    return MapBox;
});
