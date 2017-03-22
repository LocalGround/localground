require(['boot'], function () {
    /* Some useful documentation:
     * jQuery <--> Jasmine helper method documentation: https://github.com/velesin/jasmine-jquery
     * Jasmine documentation: https://jasmine.github.io/2.1/introduction
     */
    'use strict';
    var specs = [

        // COLLECTIONS
        'spec/collections/base-test.js',
        'spec/collections/photos-test.js',
        'spec/collections/audio-test.js',
        'spec/collections/prints-test.js',
        'spec/collections/mapimages-test.js',
        'spec/collections/projects-test.js',

        // CLIENT-SIDE QUERYING
        'spec/sql-parser-test.js',
        'spec/truth-statement-test.js',

        // VIEWS
        'spec/views/global-toolbar-test.js',
        'spec/views/data-manager-test.js',
        'spec/views/legend-layer-entry-test.js',
        'spec/views/audio-player-test.js',
        'spec/views/create-form-test.js',
        'spec/views/spreadsheet-test.js'
    ];

    require(specs, function () {
        window.executeTests();
    });
});
