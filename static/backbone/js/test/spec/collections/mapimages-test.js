define([
    "../../../test/spec/collections/base-test",
    "../../../test/spec-helper"
], function (Helper) {
    'use strict';

    describe("Map Image Collection: Test that generic functions work", function () {
        Helper.genericChecks({ overlay_type: "map-image" });
    });

});