define([
    "../../../test/spec/collections/base-test",
    "../../../test/spec-helper"
], function (Helper) {
    'use strict';

    describe("Prints Collection: Test that generic functions work", function () {
        Helper.genericChecks({ overlay_type: "print" });
    });

});