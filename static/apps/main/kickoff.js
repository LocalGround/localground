var configPath = (configPath || '') + 'require-config';
require([configPath], function () {
    'use strict';
    require(["jquery", "apps/main/main-app"], function ($, App) {
        $(function () {
            //window.location.hash = ''; //make sure the page initializes on the first page...
            //console.log(projectJSON);
            var app = new App({
                projectJSON: projectJSON
            });
            app.start();
        });
    });
});
