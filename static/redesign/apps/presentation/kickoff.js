require(['../require-config'], function () {
    'use strict';
    require(["jquery", "apps/presentation/presentation-app"], function ($, PresentationApp) {
        $(function () {
            var presentationApp = new PresentationApp();
            presentationApp.start();
        });
    });
});


