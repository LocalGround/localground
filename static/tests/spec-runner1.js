require(['boot'], function () {
    /* Some useful documentation:
     * jQuery <--> Jasmine helper method documentation: https://github.com/velesin/jasmine-jquery
     * Jasmine documentation: https://jasmine.github.io/2.1/introduction
     */
    'use strict';
    var specs = [
        //views:
        'spec/views/main/main-app-test.js',
        'spec/views/main/breadcrumbs-test.js',
        'spec/views/main/create-new-map-test.js',
        'spec/views/main/map-title-view-test.js',
        'spec/views/main/left-panel-view-test.js',
        'spec/views/main/edit-map-form-test.js',
        'spec/views/main/layer-list-view-test.js',,
        'spec/views/main/create-layer-form-test.js',

        //lib:
        'spec/lib/data-manager-test.js'
    ];

    require(specs, function () {
        window.executeTests();
    });
});
