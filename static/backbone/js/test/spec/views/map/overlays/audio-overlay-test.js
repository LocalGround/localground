define([
    "lib/maps/overlays/audio",
    "../../../../../test/spec/views/map/overlays/base-overlay-test",
    "../../../../../test/spec-helper"
], function (AudioOverlay, Helper) {
    'use strict';

    describe("Audio Overlay: Test that generic functions work", function () {
        Helper.genericChecks("Audio Overlay", "audio", AudioOverlay);
    });

});

