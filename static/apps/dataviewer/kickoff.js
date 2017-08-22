var configPath = (configPath || '') + 'require-config';
require([configPath], function () {
    'use strict';
    require(["jquery", "apps/dataviewer/app"], function ($, DataApp) {
        $(function () {
            //window.location.hash = ''; //make sure the page initializes on the first page...
            var app = new DataApp();
            app.start();
        });
    });
});
