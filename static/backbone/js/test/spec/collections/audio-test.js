define([
    "../../../test/spec/collections/base-test",
    "../../../test/spec-helper"
], function (Helper) {
    'use strict';

    describe("Audio Collection: Test that generic functions work", function () {
        Helper.genericChecks({ overlay_type: "audio" });
    });

});