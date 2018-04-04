require(['boot'], function () {
    /* Some useful documentation:
     * jQuery <--> Jasmine helper method documentation: https://github.com/velesin/jasmine-jquery
     * Jasmine documentation: https://jasmine.github.io/2.1/introduction
     */
    'use strict';
    var specs = [

        // MODELS
        // 'spec/models/layer-test.js',

        // // COLLECTIONS
        // 'spec/collections/base-test.js',
         'spec/collections/photos-test.js',
        // 'spec/collections/audio-test.js',
        // 'spec/collections/prints-test.js',
        // 'spec/collections/mapimages-test.js',
        // 'spec/collections/projects-test.js',

        // // CLIENT-SIDE QUERYING
        // 'spec/sql-parser-test.js',
        // 'spec/truth-statement-test.js',

        // // VIEWS
        // 'spec/views/global-toolbar-test.js',
        // 'spec/views/audio-player-new-test.js',
        // 'spec/views/audio-player-test.js',
        // 'spec/lib/data-manager-test.js',

        // //data viewer app:
        // 'spec/views/dataviewer-app-test.js',

        // //presentation app:
        // 'spec/views/presentation-app-test.js',
        // 'spec/views/presentation-legend-symbol-test.js',
        // 'spec/views/presentation-legend-layer-entry-test.js',


        // //style app left panel
        // 'spec/views/style-left-panel-test.js',
           'spec/views/style-left-map-skin-test.js'
        // 'spec/views/style-left-select-map-view-test.js',
        // 'spec/views/style-left-layer-list-view-test.js',
        // 'spec/views/style-left-layer-list-child-view-test.js',
        // 'spec/views/style-left-panel-styles-view-test.js',
        // 'spec/views/style-left-new-map-modal-view-test.js',


        // //style app right panel
        // 'spec/views/style-right-panel-test.js',
        // 'spec/views/style-right-data-source-view-test.js',
        // 'spec/views/style-right-marker-style-view-test.js',
        // 'spec/views/style-right-marker-style-view-child-test.js',
        // 'spec/views/style-right-source-code-style-view-test.js',

        // 'spec/views/project-item-test.js',
        // 'spec/views/share-form-test.js',
        // 'spec/views/project-user-test.js',
        // 'spec/views/data-detail-test.js',

        // //style app symbols selection views
        // 'spec/views/style-symbol-selection-layout-view.js',

        // // PRINT
        // 'spec/views/generate-print-test.js',
        // 'spec/views/print-options-test.js',

        // //APPS
        // 'spec/views/style-app-test.js',
        // 'spec/views/create-form-test.js',
        // 'spec/views/form-field-test.js',
        // 'spec/views/spreadsheet-test.js',
        // 'spec/views/spreadsheet-tabs-test.js',

        // //MAP Editor
        // 'spec/views/map-editor/marker-listing-manager-test.js',
        // 'spec/views/map-editor/marker-listing-test.js',
        // 'spec/views/map-editor/marker-listing-detail-test.js',

        // //FORMS
        // 'spec/lib/form-field-date-time-test.js',
        // 'spec/lib/form-field-choice-test.js',
        // 'spec/lib/form-field-rating-test.js',
        // 'spec/lib/form-field-add-media-test.js',

        // //ROUTERS
        // 'spec/views/style-router-test.js'

    ];

    require(specs, function () {
        window.executeTests();
    });
});
