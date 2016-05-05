define([
    "lib/maps/overlays/photo",
    "../../../../../test/spec/views/map/overlays/base-overlay-test",
    "../../../../../test/spec-helper"
], function (PhotoOverlay, Helper) {
    'use strict';

    describe("Marker Overlay: Test that generic functions work", function () {
        Helper.genericChecks("Photo Overlay", PhotoOverlay);
    });

});

