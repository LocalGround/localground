require(
    ["jquery", "apps/style/style-app"],
    function ($, StyleApp) {
        'use strict';
        $(function () {
            window.location.hash = ''; //make sure the page initializes on the first page...
            var styleApp = new StyleApp();
            styleApp.start();
        });
    }
);


