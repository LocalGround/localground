require(
    ["jquery", "apps/home/home-app"],
    function ($, HomeApp) {
        'use strict';
        $(function () {
            window.location.hash = ''; //make sure the page initializes on the first page...
            var home = new HomeApp({
                username: username
            });
            home.start();
        });
    }
);


