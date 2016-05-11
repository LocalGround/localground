define([
    "config",
    "../../../../../test/spec/views/map/sidepanel/base-item-test",
    "../../../../../test/spec-helper"
], function (config, Helper) {
    'use strict';

    describe("Marker Item: Test that generic functions work", function () {
        Helper.genericChecks(
            "Marker Item",
            "marker",
            config.markers.ItemView,
            config.markers.ItemTemplate
        );
    });

});

