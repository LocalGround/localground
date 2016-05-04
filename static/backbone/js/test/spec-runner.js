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
        'spec/views/map/layer-panel-test.js',
        'spec/views/map/layer-list-test.js',
        'spec/views/map/symbol-test.js',
        'spec/views/map/layer-test.js',
        'spec/views/map/layer-item-test.js',
        'spec/views/map/caption-test.js',
        'spec/views/map/fullscreenCtrl-test.js',
        'spec/views/map/upload-modal-test.js',
        'spec/views/map/print-form-test.js',
        'spec/views/map/print-mockup-test.js',
        'spec/views/map/photo-bubble-test.js',

        // VIEWS > OVERLAYS,
        'spec/views/map/overlays/map-image-test.js'

        //'spec/views/audio-player-test.js'
    ];

    require(specs, function () {
        window.executeTests();
    });
});