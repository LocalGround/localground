require(
    ["jquery", "apps/home/home-app.js"],
    function ($, HomeApp) {
        'use strict';
        $(function () {
            window.location.hash = ''; //make sure the page initializes on the first page...
            var home = new HomeApp();
            home.start();
        });
    }
);


