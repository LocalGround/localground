require(
    ["jquery", "apps/map/map-app.js"],
    function ($, MapApp) {
        'use strict';
        $(function () {
            window.location.hash = ''; //make sure the page initializes on the first page...
            var map = new MapApp();
            map.start();
        });
    }
);


