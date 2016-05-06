define([
    "views/maps/overlays/layer",
    "views/maps/overlays/layerManager",
    "collections/layers",
    "../../../../test/spec-helper"
],
    function (LayerView, LayerManager, Layers) {
        'use strict';

        function initLayerManagerEmpty(scope) {
            return new LayerManager({
                app: scope.app,
                selectedLayers: new Layers()
            });
        }
        function initLayerManager(scope) {
            return new LayerManager({
                app: scope.app,
                selectedLayers: scope.layers
            });
        }
        describe("LayerManager: Initializes and renders child views when data added and removed", function () {

            it("Can initialize a map layer", function () {
                var layerManager,
                    that = this;
                expect(function () {
                    layerManager = initLayerManagerEmpty(that);
                }).not.toThrow();
            });

            it("Yields three child LayerViews for three models added in the Layers collection", function () {
                var layerManager = initLayerManagerEmpty(this);
                layerManager.collection.add(this.layers.at(0));
                layerManager.collection.add(this.layers.at(1));
                layerManager.collection.add(this.layers.at(2));

                //ensure that three children have been rendered (one for each add):
                expect(layerManager.children.length).toBe(3);
                //make sure that children are of type LayerView
                layerManager.children.each(function (view) {
                    expect(view).toEqual(jasmine.any(LayerView));
                });
            });

            it("Yields three child LayerViews for three models passed in upon initialization", function () {
                var layerManager = initLayerManager(this);

                //ensure that three children have been rendered (one for each add):
                expect(layerManager.collection.length).toBe(3);
                expect(layerManager.children.length).toBe(3);

                //make sure that children are of type LayerView
                layerManager.children.each(function (view) {
                    expect(view).toEqual(jasmine.any(LayerView));
                });
            });

            it("Yields two child LayerViews once model is removed", function () {
                var layerManager = initLayerManager(this);

                //ensure that three children have been rendered (one for each add):
                expect(layerManager.collection.length).toBe(3);
                expect(layerManager.children.length).toBe(3);

                //remove model from collection:
                layerManager.collection.remove(this.layers.at(0));
                expect(layerManager.collection.length).toBe(2);
                expect(layerManager.children.length).toBe(2);
            });

        });
    });
