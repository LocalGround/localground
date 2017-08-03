require(['/static/redesign/apps/require-config.js'], function () {
    'use strict';
    require(["jquery", "apps/presentation/presentation-app"], function ($, PresentationApp) {
        $(function () {
            var presentationApp = new PresentationApp();
            presentationApp.start();
        });
    });
});


