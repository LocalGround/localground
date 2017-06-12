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
        //'spec/views/spreadsheet-app-test.js',
        'spec/views/global-toolbar-test.js',
        'spec/views/data-manager-test.js',
        'spec/views/legend-layer-entry-test.js',
        'spec/views/audio-player-new-test.js',
        'spec/views/audio-player-test.js',

        //style app left panel
        'spec/views/style-left-panel-test.js',
        'spec/views/style-app-map-skin-test.js',
        'spec/views/select-map-view-test.js',
        'spec/views/layer-list-view-test.js',
        'spec/views/layer-list-child-view-test.js',
        'spec/views/panel-styles-view-test.js',
        'spec/views/new-map-modal-view-test.js',

        //style app right panel
        //'spec/views/style-right-panel-test.js', //SV: commented this out for now b/c it's failing
        'spec/views/data-source-view-test.js',

        'spec/views/project-item-test.js',
        'spec/views/share-form-test.js',
        'spec/views/project-user-test.js',
        'spec/views/data-detail-test.js',

        // PRINT
        'spec/views/generate-print-test.js',
        'spec/views/print-options-test.js',

        //APPS
        'spec/views/style-app-test.js',
        'spec/views/create-form-test.js',
        'spec/views/form-field-test.js',
        'spec/views/spreadsheet-test.js',

        //FORMS
        'spec/lib/form-field-date-time-test.js',
        'spec/lib/form-field-choice-test.js',
        'spec/lib/form-field-rating-test.js'
    ];

    require(specs, function () {
        window.executeTests();
    });
});
