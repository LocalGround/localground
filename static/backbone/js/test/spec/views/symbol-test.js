define([
    "underscore",
    "views/maps/overlays/layer",
    "lib/maps/data/dataManager",
    "../../../test/spec-helper"
],
    function (_, LayerView, DataManager) {
        'use strict';

        function initLayerView(scope) {
            return new LayerView({
                app: scope.app,
                model: scope.layers.at(0)
            });
        }
        describe("Layer view: Map Layer can be initialized & drawn", function () {

            /*it("Can initialize a map layer", function () {
                var layerView,
                    that = this;
                expect(function () {
                    layerView = initLayerView(that);
                }).not.toThrow();
                expect(layerView.dataManager).toEqual(jasmine.any(DataManager));
                expect(_.isObject(layerView.overlays)).toBeTruthy();
            });

            it("Correctly renders \"Symbolized\" overlays on initialization", function () {
                var layerView = initLayerView(this);

                //ensure that the underlying model has 3 symbols:
                expect(layerView.model.getSymbols().length).toBe(2);
            });*/

        });

    });
