require(['boot'], function () {
    /* Some useful documentation:
     * jQuery <--> Jasmine helper method documentation: https://github.com/velesin/jasmine-jquery
     * Jasmine documentation: https://jasmine.github.io/2.1/introduction
     */
    'use strict';
    var specs = [
        'spec/views/main-app-test.js',
        'spec/views/main/breadcrumbs-test.js',
        'spec/views/main/map-title-view-test.js',
    ];

    require(specs, function () {
        window.executeTests();
    });
});
