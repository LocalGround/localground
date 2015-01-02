require(['boot'], function () {
    'use strict';
    var specs = [
        'spec/sql-parser-test.js',
        //'/static/backbone/js/external/jasmine-2.1.3/spec/PlayerSpec.js'
    ];
    require(specs, function () {
        window.onload();
    });
});