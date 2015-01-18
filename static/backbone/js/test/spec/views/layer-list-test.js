define([
    "views/maps/sidepanel/items/layerItem",
    "views/maps/sidepanel/layerList",
    "../../../test/spec-helper"
],
    function (LayerItem, LayerList) {
        'use strict';

        function initLayerList(scope) {
            return new LayerList({
                app: scope.app
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
                //Weird: these work in the application, but need to be manually applied for
                //the tests to work. Not sure why. 
                layerList.applyEventHandlerBugfix();

                //add to the layers collection:
                layerList.collection.add(m1);
                layerList.collection.add(m2);

                //ensure that three children have been rendered (one for each add):
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
                var layerList = initLayerList(this);

                //As stated above, these work in the application, but need to be 
                //manually applied for the tests to work.
                layerList.applyEventHandlerBugfix();

                this.app.vent.trigger('add-layer', this.layers.at(0));
                this.app.vent.trigger('add-layer', this.layers.at(1));

                //ensure that three children have been rendered (one for each add):
                expect(layerList.children.length).toBe(2);
                //make sure that children are of type LayerView
                layerList.children.each(function (view) {
                    expect(view).toEqual(jasmine.any(LayerItem));
                });
            });

        });
    });
