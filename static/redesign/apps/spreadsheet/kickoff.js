require(['../require-config'], function () {
    'use strict';
    require(["jquery", "apps/spreadsheet/spreadsheet-app"], function ($, SpreadsheetApp) {
        $(function () {
            window.location.hash = ''; //make sure the page initializes on the first page...
            var spreadsheet = new SpreadsheetApp();
            spreadsheet.start();
        });
    });
});


