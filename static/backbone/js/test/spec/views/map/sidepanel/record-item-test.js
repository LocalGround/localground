define([
    "config",
    "../../../../../test/spec/views/map/sidepanel/base-item-test",
    "../../../../../test/spec-helper"
], function (config, Helper) {
    'use strict';

    describe("Record Item: Test that generic functions work", function () {
        Helper.genericChecks(
            "Record Item",
            "record",
            config.form.ItemView,
            config.form.ItemTemplate
        );
    });

});

