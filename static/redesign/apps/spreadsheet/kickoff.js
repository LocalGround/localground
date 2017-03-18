require(
    ["jquery", "apps/spreadsheet/spreadsheet-app.js"],
    function ($, SpreadsheetApp) {
        'use strict';
        $(function () {
            window.location.hash = ''; //make sure the page initializes on the first page...
            var spreadsheet = new SpreadsheetApp();
            spreadsheet.start();
        });
    }
);


