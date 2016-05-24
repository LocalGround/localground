define([
    "lib/maps/overlays/marker",
    "../../../../../test/spec/views/map/overlays/base-overlay-test",
    "../../../../../test/spec-helper"
], function (MarkerOverlay, Helper) {
    'use strict';

    describe("Marker Overlay: Test that generic functions work", function () {
        Helper.genericChecks("Marker Overlay", "marker", MarkerOverlay);
    });

});

