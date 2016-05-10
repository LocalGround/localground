define([
    "lib/maps/overlays/record",
    "../../../../../test/spec/views/map/overlays/base-overlay-test",
    "../../../../../test/spec-helper"
], function (RecordOverlay, Helper) {
    'use strict';

    describe("Record Overlay: Test that generic functions work", function () {
        Helper.genericChecks("Record Overlay", "record", RecordOverlay);
    });

});

