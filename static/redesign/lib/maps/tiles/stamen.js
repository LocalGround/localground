define(["jquery"], function ($) {
    "use strict";
    var Stamen = function (opts) {
        /*
         * http://a.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg
         */
        this.maxZoom = opts.max;
        this.name = opts.name;
        this.ext = opts.url.split('{y}');
        this.ext = (this.ext.length > 0) ? this.ext[1] : '';
        console.log(opts.url, this.ext);
        this.url = opts.url.split('{z}')[0].split('//')[1];
        this.tileSize = new google.maps.Size(256, 256);
        this.getTile = function (coord, zoom) {
            var url = '//' + ['', 'a.', 'b.'][parseInt(Math.random() * 3, 10)] + this.url;
            return $('<div></div>').css({
                'width': '256px',
                'height': '256px',
                'backgroundImage': 'url(' + url + zoom + '/' +
                    coord.x + '/' + coord.y + this.ext + ')'
            }).get(0);
        };
    };
    return Stamen;
});
