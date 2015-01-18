define([
    "views/maps/overlays/layer",
    "../../../test/spec-helper"
],
    function (LayerView) {
        'use strict';

        function initLayerView(scope) {
            return new LayerView({
                app: scope.app,
                model: scope.layers.get(0)
            });
        }
        describe("Layer view: Map Layer can be initialized & drawn", function () {

            it("Can initialize a map layer", function () {
                var layerView,
                    that = this;
                expect(function () {
                    layerView = initLayerView(that);
                }).not.toThrow();
            });

        });

    });
