define([
    "views/maps/sidepanel/items/layerItem",
    "../../../test/spec-helper"
],
    function (LayerItem) {
        'use strict';
        describe("Layer View: Map Layer can be initialized & drawn", function () {
            it("Can initialize a map layer", function () {
                var that = this;
                expect(function () {
                    var layerItem = new LayerItem({
                        model: that.layers.at(0),
                        app: that.app
                    });
                }).not.toThrow();
            });
        });
    });
