define([
    "config",
    "../../../../../test/spec/views/map/sidepanel/base-item-test",
    "../../../../../test/spec-helper"
], function (config, Helper) {
    'use strict';

    describe("Map Image Item: Test that generic functions work", function () {
        Helper.genericChecks(
            "Map Image Item",
            "map-image",
            config.map_images.ItemView,
            config.map_images.ItemTemplate
        );
    });

});

