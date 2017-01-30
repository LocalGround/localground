require(
    ["jquery", "apps/presentation/presentation-app.js"],
    function ($, PresentationApp) {
        'use strict';
        $(function () {
            window.location.hash = ''; //make sure the page initializes on the first page...
            var presentationApp = new PresentationApp();
            presentationApp.start();
        });
    }
);


