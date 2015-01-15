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
                    symbol = layerItem1.model.getSymbol("worms > 0"),
                    show_symbol_triggered = false,
                    hide_symbol_triggered = false;

                //ensure that event handlers get called:
                function checkShowing() { expect(show_symbol_triggered).toBeTruthy(); }
                function checkHiding() { expect(hide_symbol_triggered).toBeTruthy(); }

                layerItem1.app.vent.on("show-symbol", function () {
                    show_symbol_triggered = true;
                    checkShowing();
                });
                layerItem1.app.vent.on("hide-symbol", function () {
                    hide_symbol_triggered = true;
                    checkHiding();
                });

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
        });
    });
