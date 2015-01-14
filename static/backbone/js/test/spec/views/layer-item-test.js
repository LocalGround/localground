define([
    "underscore",
    "jquery",
    "views/maps/sidepanel/items/layerItem",
    "../../../test/spec-helper",
    'jasmine-jquery' //for jquery helpers. Available methods here: https://github.com/velesin/jasmine-jquery
],
    function (_, $, LayerItem) {
        'use strict';
        var layerItem1,
            layerItem2;
        describe("LayerItem: Sidepanel layer can be initialized & drawn", function () {
            it("Can initialize", function () {
                var that = this;
                expect(function () {
                    layerItem1 = new LayerItem({
                        model: that.layers.at(0),
                        app: that.app
                    });
                    layerItem2 = new LayerItem({
                        model: that.layers.at(2),
                        app: that.app
                    });
                }).not.toThrow();
            });

            it("Renders the correct template", function () {
                layerItem1.render();
                layerItem2.render();
                expect(layerItem1.$el).toContainElement('.layer-list');
                expect(layerItem2.$el).toContainElement('.layer-simple');
            });

            it("Adds the correct variables to the template context", function () {
                var context1 = layerItem1.templateHelpers(),
                    context2 = layerItem2.templateHelpers();
                _.each(["name", "symbols", "showOverlay"], function (key) {
                    expect(_.isUndefined(context1[key])).toBeFalsy();
                    expect(_.isUndefined(context2[key])).toBeFalsy();
                });

                //ensure that layerItem2 also has an "item" object (and that layerItem1 doesn't). 
                expect(_.isUndefined(context2.item)).toBeFalsy();
                expect(_.isUndefined(context1.item)).toBeTruthy();
            });
        });

        describe("LayerItem: make sure event handlers are working", function () {
            it("Symbol event handlers working", function () {
                layerItem1 = new LayerItem({
                    model: this.layers.at(0),
                    app: this.app
                });
                layerItem1.render();

                //trigger the checkbox click event:
                var $cb = layerItem1.$el.find('.cb-layer-item:first'),
                    //spyEvent = spyOnEvent($cb, 'click'),
                    symbol = layerItem1.model.getSymbol("worms > 0");
                console.log(symbol.showOverlay);
                expect($cb).not.toBeChecked();
                $cb.trigger('click');
                //expect('click').toHaveBeenTriggeredOn($cb);
                //expect(spyEvent).toHaveBeenTriggered();

                expect($cb).toBeChecked();
                console.log(symbol.showOverlay);
                expect(symbol.showOverlay).toBeTruthy();
                //$cb.click();
                //expect($cb).not.toBeChecked();
                //expect(layerItem1.model.getSymbol("worms > 0").showOverlay).toBeTruthy();
            });
        });
    });
