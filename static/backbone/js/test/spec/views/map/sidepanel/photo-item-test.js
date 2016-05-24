define([
    "config",
    "../../../../../test/spec/views/map/sidepanel/base-item-test",
    "../../../../../test/spec-helper"
], function (config, Helper) {
    'use strict';

    describe("Photo Item: Test that generic functions work", function () {
        Helper.genericChecks(
            "Photo Item",
            "photo",
            config.photos.ItemView,
            config.photos.ItemTemplate
        );
    });

});

