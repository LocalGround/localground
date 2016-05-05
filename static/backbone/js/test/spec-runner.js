require(['boot'], function () {
    'use strict';
    var specs = [
        // LIB
        'spec/sql-parser-test.js',
        'spec/truth-statement-test.js',
        'spec/data-manager-test.js',
        'spec/snapshot-loader-test.js',

        // MODELS
        'spec/models/layer-test.js',

        // COLLECTIONS
        'spec/collections/base-test.js',
        'spec/collections/layers-test.js',

        // VIEWS
        'spec/views/map/basemap-test.js',
        'spec/views/map/layer-manager-test.js',
        'spec/views/map/symbol-test.js',
        'spec/views/map/layer-test.js',
        'spec/views/map/caption-test.js',
        'spec/views/map/fullscreenCtrl-test.js',
        'spec/views/map/upload-modal-test.js',
        'spec/views/map/print-form-test.js',
        'spec/views/map/print-mockup-test.js',
        'spec/views/map/photo-bubble-test.js',

        // VIEWS > OVERLAYS
        'spec/views/map/overlays/mapimage-overlay-test.js',
        'spec/views/map/overlays/marker-overlay-test.js',
        'spec/views/map/overlays/photo-overlay-test.js',
        'spec/views/map/overlays/audio-overlay-test.js',
        'spec/views/map/overlays/record-overlay-test.js',

        // VIEWS > SIDEPANEL
        'spec/views/map/sidepanel/layer-panel-test.js',
        'spec/views/map/sidepanel/layer-list-test.js',
        'spec/views/map/sidepanel/layer-item-test.js',
        'spec/views/map/sidepanel/photo-item-test.js',
        'spec/views/map/sidepanel/audio-item-test.js',
        'spec/views/map/sidepanel/marker-item-test.js',
        'spec/views/map/sidepanel/record-item-test.js',
        'spec/views/map/sidepanel/mapimage-item-test.js'

        //'spec/views/audio-player-test.js'
    ];

    require(specs, function () {
        window.executeTests();
    });
});