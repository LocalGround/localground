define([
    "views/maps/overlays/layer",
    "../../../test/spec-helper"
],
    function (LayerView) {
        'use strict';
        describe("Layer View: Map Layer can be initialized & drawn", function () {
            it("Can initialize a map layer", function () {
                var that = this;
                expect(function () {
                    var layerView = new LayerView({
                        app: that.app,
                        dataManager: that.app.dataManager,
                        model: that.layers.at(0),
                        map: that.app.map
                    });
                }).not.toThrow();
            });
        });
    });
