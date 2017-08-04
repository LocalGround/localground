var configPath = (configPath || '') + 'require-config';
require([configPath], function () {
    'use strict';
    require(["jquery", "apps/presentation/presentation-app"], function ($, PresentationApp) {
        $(function () {
            var presentationApp = new PresentationApp();
            presentationApp.start();
        });
    });
});


