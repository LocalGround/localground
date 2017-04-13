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
            this.showAttribution();
            var url = '//' + ['', 'a.', 'b.'][parseInt(Math.random() * 3, 10)] + this.url;
            return $('<div></div>').css({
                'width': '256px',
                'height': '256px',
                'backgroundImage': 'url(' + url + zoom + '/' +
                    coord.x + '/' + coord.y + '?access_token=' + MAPBOX_API_KEY + ')'
            }).get(0);
        };

        this.showAttribution = function () {
            var $message = $('<span class="tile-attribution">Map tiles by <a href="http://mapbox.com">MapBox</a>.</span>');
            $('.tile-attribution').remove();
            $('.gm-style-cc span').parent().append($message);
            $message.css({
                "width": 110,
                "margin-left": "-95",
                "background-color": 'rgba(255, 255, 255, 0.7)'
            });
            $message.parent().prev().hide();
        };

    };
    return MapBox;
});
