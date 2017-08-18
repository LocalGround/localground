var configPath = (configPath || '') + 'require-config';
require([configPath], function () {
    'use strict';
    require(["jquery", "apps/home/home-app"], function ($, App) {
        $(function () {
            var app = new App();
            app.start();
        });
    });
});


