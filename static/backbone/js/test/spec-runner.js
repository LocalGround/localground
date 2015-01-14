require(['boot'], function () {
    'use strict';
    var specs = [
        'spec/sql-parser-test.js',
        'spec/truth-statement-test.js',
        'spec/data-manager-test.js',
        'spec/models/layer-test.js',
        'spec/collections/base-test.js',
        'spec/collections/layers-test.js'
    ];
    require(specs, function () {
        window.onload();
    });
});