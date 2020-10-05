define(["jquery"], function ($) {
    "use strict";
    var Stamen = function (opts) {
        /*
         * https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png
         * https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/12/37.7706/-122.3782
         */
        this.maxZoom = opts.max;
        this.name = opts.name;
        this.ext = opts.url.split('{y}');
        this.ext = (this.ext.length > 0) ? this.ext[1] : '';
        this.url = opts.url.split('{s}')[1];
        this.url =  this.url.split('{z}')[0];
        console.log(this.url);
        this.tileSize = new google.maps.Size(256, 256);
        this.getTile = function (coord, zoom) {
            var url = 'https://stamen-tiles-' + 'abcd'[Math.floor(Math.random() * 4)] + this.url;
            console.log(url);
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
