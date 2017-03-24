require(
    ["jquery", "apps/presentation/presentation-app"],
    function ($, PresentationApp) {
        'use strict';
        $(function () {
            var presentationApp = new PresentationApp();
            presentationApp.start();
        });
    }
);


