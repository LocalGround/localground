define([
    "underscore",
    "views/maps/sidepanel/items/layerItem",
    "../../../test/spec-helper",
    'jasmine-jquery' //for jquery helpers. Available methods here: https://github.com/velesin/jasmine-jquery
],
    function (_, LayerItem) {
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
                _.each(["name", "symbols", "isShowingOnMap"], function (key) {
                    expect(_.isUndefined(context1[key])).toBeFalsy();
                    expect(_.isUndefined(context2[key])).toBeFalsy();
                });

                //ensure that layerItem2 also has an "item" object (and that layerItem1 doesn't). 
                expect(_.isUndefined(context2.item)).toBeFalsy();
                expect(_.isUndefined(context1.item)).toBeTruthy();
            });
        });

        describe("LayerItem: make sure symbol checkbox event handlers are working", function () {
            var symbolChanged = false;
            it("Symbol-level checkbox event handlers working", function () {
                layerItem1 = new LayerItem({
                    model: this.layers.at(0),
                    app: this.app
                });
                layerItem1.render();

                //trigger the checkbox click event:
                var $cb = layerItem1.$el.find('.cb-layer-item:first'),
                    symbol = layerItem1.model.getSymbol("worms > 0"),
                    model = this.layers.at(0);

                //add model listener, to be sure that checkbox raises the 'symbol-triggered'
                //event for the Layer model being referenced:
                model.on('symbol-change', function () { symbolChanged = true; });
                expect(symbolChanged).toBeFalsy();

                //ensure that event handler behaves correctly when checkbox is off:
                //http://bugs.jquery.com/ticket/3827#comment:9
                $cb.attr('checked', false);
                $cb.trigger('click');
                expect(symbol.isShowingOnMap).toBeFalsy();

                //ensure that event handler behaves correctly when checkbox is on:
                $cb.attr('checked', true);
                $cb.trigger('click');
                expect(symbol.isShowingOnMap).toBeTruthy();
            });

            it("Layer model's'symbol-change' event triggered successfully", function () {
                expect(symbolChanged).toBeTruthy();
            });
        });

        describe("LayerItem: make sure layer checkbox event handlers are working", function () {
            var modelChanged = false;
            it("Layer-level event handlers working", function () {
                layerItem1 = new LayerItem({
                    model: this.layers.at(0),
                    app: this.app
                });
                layerItem1.render();
                var $cb = layerItem1.$el.find('.check-all'),
                    model = this.layers.at(0);

                //add model listener, to be sure that checkbox raises the 'change:isShowingOnMap'
                //event for the Layer model being referenced:
                model.on('change:isShowingOnMap', function () { modelChanged = true; });
                expect(modelChanged).toBeFalsy();

                //ensure that event handler behaves correctly when checkbox is off:
                $cb.attr('checked', false);
                $cb.trigger('click');
                expect(layerItem1.model.get("isShowingOnMap")).toBeFalsy();

                //ensure that event handler behaves correctly when checkbox is on:
                $cb.attr('checked', true);
                $cb.trigger('click');
                expect(layerItem1.model.get("isShowingOnMap")).toBeTruthy();
            });

            it("Layer model's 'change:isShowingOnMap' event triggered successfully", function () {
                expect(modelChanged).toBeTruthy();
            });
        });

        describe("LayerItem: ensure that zoomToExtent event handlers are working", function () {
            var zoomToExtent = false;
            it("Variables all initialize as unchanged", function () {
                //initialize layer and attach event listeners:
                layerItem1 = new LayerItem({
                    model: this.layers.at(0),
                    app: this.app
                });
                layerItem1.render(); //don't forget to render the item before searching within it.
                var model = this.layers.at(0),
                    $zoomButton = layerItem1.$el.find('.zoom-to-extent');

                model.on('zoom-to-layer', function () { zoomToExtent = true; });
                expect(zoomToExtent).toBeFalsy();

                //trigger all events:
                $zoomButton.trigger('click');
            });

            it("Layer model's'zoom-to-layer' event triggered successfully", function () {
                expect(zoomToExtent).toBeTruthy();
            });
        });

    });
