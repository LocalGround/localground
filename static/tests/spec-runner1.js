require(['boot'], function () {
    /* Some useful documentation:
     * jQuery <--> Jasmine helper method documentation: https://github.com/velesin/jasmine-jquery
     * Jasmine documentation: https://jasmine.github.io/2.1/introduction
     */
    'use strict';
    var specs = [
        // Main App:
        'spec/views/main/add-marker-menu-test.js',
        'spec/views/main/edit-layer-menu-test.js',
        'spec/views/main/main-app-test.js',
        'spec/views/main/breadcrumbs-test.js',
        'spec/views/main/map-menu-test.js',
        'spec/views/main/create-new-map-test.js',
        'spec/views/main/create-layer-form-test.js',
        'spec/views/main/map-title-view-test.js',
        'spec/views/main/left-panel-view-test.js',
        'spec/views/main/edit-map-form-test.js',
        'spec/views/main/layer-list-view-test.js',
        'spec/views/main/create-layer-form-test.js',
        'spec/views/main/layer-list-child-view-test.js',
        'spec/views/main/symbol-collection-view-test.js',

        // Presentation App
        'spec/views/presentation/presentation-app-test.js',
        'spec/views/presentation/legend-symbol-entry-test.js',
        'spec/views/presentation/legend-layer-entry-test.js',
        'spec/views/presentation/title-card-test.js',

        'spec/views/main/symbol-style-menu-view-test.js',
        'spec/views/main/marker-style-view-test.js',
        'spec/views/main/edit-title-card-test.js',
        'spec/views/main/presentation-options-test.js',
        'spec/views/main/share-settings-test.js',

        //spreadsheet tests:
        'spec/views/main/spreadsheet-test.js',
        'spec/views/main/spreadsheet-context-menu-test.js',
        'spec/views/main/spreadsheet-layout-test.js',
        'spec/views/main/edit-field-test.js',
        'spec/views/main/add-field-test.js',
        'spec/views/main/rename-dataset-test.js',


        // trouble mocking a Record to test the DataDetail View
        'spec/views/main/data-detail-test.js',

        //lib:
        'spec/lib/data-manager-test.js',
        'spec/lib/drawing-manager-test.js',
        'spec/lib/mouse-mover-test.js',
        'spec/lib/modal-test.js',
        'spec/lib/popover-test.js',
        'spec/lib/carousel-test.js',
        'spec/sql-parser-test.js',
        'spec/truth-statement-test.js',
        'spec/lib/edit-media-info-test.js',

        // models
        'spec/models/layer-test.js',
        'spec/models/symbol-test.js',

        // collections
        'spec/collections/symbols-test.js',
        'spec/collections/records-test.js'

    ];

    require(specs, function () {
        window.executeTests();
    });
});
