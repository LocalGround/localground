define([
    "config",
    "../../../../../test/spec/views/map/sidepanel/base-item-test",
    "../../../../../test/spec-helper"
], function (config, Helper) {
    'use strict';

    describe("Audio Item: Test that generic functions work", function () {
        Helper.genericChecks(
            "Audio Item",
            "audio",
            config.audio.ItemView,
            config.audio.ItemTemplate
        );
    });

});

