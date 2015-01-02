require(['boot'], function () {
    'use strict';
    var specs = [
        'spec/sql-parser-test.js',
        'spec/truth-statement-test.js'
    ];
    require(specs, function () {
        window.onload();
    });
});