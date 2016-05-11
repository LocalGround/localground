define([
    "views/maps/sidepanel/items/layerItem",
    "views/maps/sidepanel/layerList",
    "collections/layers",
    "../../../../../test/spec-helper"
],
    function (LayerItem, LayerList, Layers) {
        'use strict';

        function initLayerList(scope) {
            return new LayerList({
                app: scope.app,
                selectedLayers: new Layers()
            });
        }
        describe("LayerList: Initializes and renders child views when data added and removed", function () {

            it("Can initialize a map layer", function () {
                var layerList,
                    that = this;
                expect(function () {
                    layerList = initLayerList(that);
                }).not.toThrow();
            });

            it("Yields two child LayerItems when 2 models are added to / removed from the Layers collection", function () {
                var layerList = initLayerList(this),
                    m1 = this.layers.at(0),
                    m2 = this.layers.at(1);

                // Weird: Marionette event handlers work in the application,
                // but need to be manually applied for the tests to work.
                // Not sure what's going on. 
                layerList.applyEventHandlerBugfix();

                //add to the layers collection:
                layerList.collection.add(m1);
                layerList.collection.add(m2);

                //ensure that two children have been rendered (one for each add):
                expect(layerList.children.length).toBe(2);

                //make sure that children are of type LayerView
                layerList.children.each(function (view) {
                    expect(view).toEqual(jasmine.any(LayerItem));
                });

                //remove from layers collection:
                layerList.collection.remove(m1);
                layerList.collection.remove(m2);
                expect(layerList.children.length).toBe(0);
            });

            it("Yields two child LayerItems when 2 models are added / removed via the global event handlers", function () {
                var layerList = initLayerList(this),
                    m1 = this.layers.at(0),
                    m2 = this.layers.at(1);

                // As stated above, Marionette event handlers work in the application,
                // but need to be manually applied for the tests to work.
                layerList.applyEventHandlerBugfix();

                this.app.vent.trigger('add-layer', m1);
                this.app.vent.trigger('add-layer', m2);

                //ensure that two children have been rendered (one for each add):
                expect(layerList.children.length).toBe(2);

                //make sure that children are of type LayerView
                layerList.children.each(function (view) {
                    expect(view).toEqual(jasmine.any(LayerItem));
                });

                //remove the models:
                //remove from layers collection:
                this.app.vent.trigger('remove-layer', m1);
                this.app.vent.trigger('remove-layer', m2);
                expect(layerList.children.length).toBe(0);
            });

        });
    });
