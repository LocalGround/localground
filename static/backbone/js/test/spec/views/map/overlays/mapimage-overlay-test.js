define([
    "lib/maps/overlays/map-image",
    "../../../../../test/spec/views/map/overlays/base-overlay-test",
    "../../../../../test/spec-helper"
], function (MapImageOverlay, Helper) {
    'use strict';

    describe("Map Image Overlay: Test that it initializes correctly", function () {
        Helper.genericChecks("Map Image Overlay", "map-image", MapImageOverlay);
    });

});