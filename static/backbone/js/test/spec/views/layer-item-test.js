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
            function checkTriggered(name, val) {
                console.log(name + " was triggered");
                expect(val).toBeTruthy();
            }
            it("Symbol-level event handlers working", function () {
                layerItem1 = new LayerItem({
                    model: this.layers.at(0),
                    app: this.app
                });
                layerItem1.render();

                //trigger the checkbox click event:
                var $cb = layerItem1.$el.find('.cb-layer-item:first'),
                    symbol = layerItem1.model.getSymbol("worms > 0");

                //ensure that event handlers get called:
                layerItem1.app.vent.on("show-symbol", function () { checkTriggered('show-symbol', true); });
                layerItem1.app.vent.on("hide-symbol", function () { checkTriggered('hide-symbol', true); });

                //ensure that event handler behaves correctly when checkbox is off:
                //http://bugs.jquery.com/ticket/3827#comment:9
                $cb.attr('checked', false);
                $cb.trigger('click');
                expect(symbol.showOverlay).toBeFalsy();

                //ensure that event handler behaves correctly when checkbox is on:
                $cb.attr('checked', true);
                $cb.trigger('click');
                expect(symbol.showOverlay).toBeTruthy();
            });

            it("Layer-level event handlers working", function () {
                layerItem1 = new LayerItem({
                    model: this.layers.at(0),
                    app: this.app
                });
                layerItem1.render();

                //ensure that event handlers get called:
                layerItem1.app.vent.on("show-layer", function () { checkTriggered('show-layer', true); });
                layerItem1.app.vent.on("hide-layer", function () { checkTriggered('hide-layer', true); });

                var $cb = layerItem1.$el.find('.check-all');

                //ensure that event handler behaves correctly when checkbox is off:
                $cb.attr('checked', false);
                $cb.trigger('click');
                expect(layerItem1.showOverlay).toBeFalsy();

                //ensure that event handler behaves correctly when checkbox is on:
                $cb.attr('checked', true);
                $cb.trigger('click');
                expect(layerItem1.showOverlay).toBeTruthy();
            });
        });
    });
