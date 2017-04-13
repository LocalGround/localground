define(["jquery"], function ($) {
    "use strict";
    var Stamen = function (opts) {
        /*
         * http://a.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg
         * http://maps.stamen.com/#terrain/12/37.7706/-122.3782
         */
        this.maxZoom = opts.max;
        this.name = opts.name;
        this.ext = opts.url.split('{y}');
        this.ext = (this.ext.length > 0) ? this.ext[1] : '';
        this.url = opts.url.split('{z}')[0].split('//')[1];
        this.tileSize = new google.maps.Size(256, 256);
        this.getTile = function (coord, zoom) {
            console.log('getTile');
            this.showAttribution();
            var url = '//' + ['', 'a.', 'b.'][parseInt(Math.random() * 3, 10)] + this.url;
            return $('<div></div>').css({
                'width': '256px',
                'height': '256px',
                'backgroundImage': 'url(' + url + zoom + '/' +
                    coord.x + '/' + coord.y + this.ext + ')'
            }).get(0);
        };

        this.showAttribution = function () {
            var $message = $('<span class="tile-attribution">Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.</span>');
            $('.tile-attribution').remove();
            $('.gm-style-cc span').parent().append($message);
            $message.css({
                "width": 220,
                "margin-left": "-205",
                "background-color": 'rgba(255, 255, 255, 0.7)'
            });
            $message.parent().prev().hide();
        };
    };
    return Stamen;
});
