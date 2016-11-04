require(['boot'], function () {
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

        //APPS
        'spec/apps/gallery/gallery-app-test.js',
        'spec/apps/spreadsheet/spreadsheet-app-test.js'

        //PROFILE VIEWS
        /*'spec/views/profile/profile-app-test.js',
        'spec/views/profile/list-edit-view-test.js',
        'spec/views/profile/side-bar-view-test.js',
        'spec/views/profile/filter-view-test.js',
        'spec/views/profile/edit-item-view-test.js',

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
        'spec/views/map/sidepanel/mapimage-item-test.js'*/

        //'spec/views/audio-player-test.js'
    ];

    require(specs, function () {
        window.executeTests();
    });
});
