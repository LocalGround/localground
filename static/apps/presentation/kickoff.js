var configPath = (configPath || '') + 'require-config';
require([configPath], function () {
    'use strict';
    require(["jquery", "apps/presentation/presentation-app"], function ($, App) {
        $(function () {
            var app = new App({
                projectJSON: projectJSON,
                mapJSON: mapJSON
            });
            app.start();
        });
    });
});
