define([
    "tests/spec/collections/base-test",
    "tests/spec-helper"
], function (Helper) {
    'use strict';

    describe("Map Image Collection: Test that generic functions work", function () {
        Helper.genericChecks({ overlay_type: "map-image" });
    });

});