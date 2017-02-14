require(
    ["jquery", "apps/presentation/presentation-app.js"],
    function ($, PresentationApp) {
        'use strict';
        $(function () {
            var presentationApp = new PresentationApp();
            presentationApp.start();
        });
    }
);


