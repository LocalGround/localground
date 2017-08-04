var configPath = (configPath || '') + 'require-config';
require([configPath], function () {
    'use strict';
    require(["jquery", "apps/map/map-app"], function ($, App) {
        $(function () {
            var app = new App();
            app.start();
        });
    });
});



