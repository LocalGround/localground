define([
    "../../../test/spec/collections/base-test",
    "../../../test/spec-helper"
], function (Helper) {
    'use strict';

    describe("Projects Collection: Test that generic functions work", function () {
        Helper.genericChecks({ overlay_type: "project", query: "name contains project" });
    });

});