require(['boot'], function () {
    'use strict';
    var specs = [
        // LIB
        'spec/sql-parser-test.js',
        'spec/truth-statement-test.js',
        'spec/data-manager-test.js',
        'spec/snapshot-loader-test.js',

        // MODELS
        'spec/models/field-test.js',
        'spec/models/layer-test.js',

        // COLLECTIONS
        'spec/collections/base-test.js',
        'spec/collections/layers-test.js',
        'spec/collections/columns-test.js',

        // SPREADSHEET
        'spec/spreadsheet/backgrid-test.js',
        'spec/spreadsheet/cell-header-test.js',
        'spec/spreadsheet/column-manager-test.js',
        'spec/spreadsheet/datagrid-test.js',
        'spec/spreadsheet/table-editor-test.js',
        'spec/spreadsheet/table-header-test.js',
        'spec/spreadsheet/table-layout-test.js',

        // VIEWS
        'spec/views/basemap-test.js',
        'spec/views/layer-manager-test.js',
        'spec/views/layer-panel-test.js',
        'spec/views/layer-list-test.js',
        'spec/views/symbol-test.js',
        'spec/views/layer-test.js',
        'spec/views/layer-item-test.js',
        'spec/views/caption-test.js',
        'spec/views/fullscreenCtrl-test.js',
        'spec/views/upload-modal-test.js',
        'spec/views/photo-bubble-test.js'
        //'spec/views/audio-player-test.js'
    ];
    require(specs, function () {
        window.onload();
    });
});