var rootDir = "../../";
define([
    'jquery',
    rootDir + "apps/style/views/right/marker-style-view-child"
],
    function ($, MarkerStyleChildView) {
        'use strict';
        var markerStyleChildView,
            fixture,
            parentLayer,
            symbol,
            initSpies = function (that) {
                spyOn(that.app.vent, 'trigger').and.callThrough();
                spyOn(MarkerStyleChildView.prototype, 'initialize').and.callThrough();
                spyOn(MarkerStyleChildView.prototype, 'render').and.callThrough();
                spyOn(MarkerStyleChildView.prototype, 'onRender').and.callThrough();
                spyOn(MarkerStyleChildView.prototype, 'updateSymbolOpacity').and.callThrough();
                spyOn(MarkerStyleChildView.prototype, 'setSymbol').and.callThrough();
                spyOn(MarkerStyleChildView.prototype, 'updateLayerSymbols').and.callThrough();

                //color picker spies:
                spyOn($.prototype, 'ColorPicker').and.callThrough();
            },

            initView = function (that) {
                parentLayer = that.testMap.get("layers").at(0);
                symbol = parentLayer.getSymbols().at(0);
                markerStyleChildView = new MarkerStyleChildView({
                    app: that.app,
                    layer: parentLayer,
                    model: symbol,
                    dataType: parentLayer.get("layer_type")
                });
                markerStyleChildView.render();
                fixture = setFixtures('<div></div>');
                fixture.append(markerStyleChildView.$el);
            };


        describe("When MarkerStyleChildView is initialized:", function () {
            beforeEach(function () {
                initSpies(this);
                initView(this);
            });

            afterEach(function () {
                $(".marker-child-color-picker").remove();
            });

            it("should set properties and call initialization methods", function () {
                expect(markerStyleChildView).toEqual(jasmine.any(MarkerStyleChildView));
                expect(MarkerStyleChildView.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(MarkerStyleChildView.prototype.render).toHaveBeenCalledTimes(1);
                expect(MarkerStyleChildView.prototype.onRender).toHaveBeenCalledTimes(1);
                expect(markerStyleChildView.model).toBe(symbol);
                expect(markerStyleChildView.layer).toBe(parentLayer);
            });

            it("should initialize the color picker appropriately", function () {
                expect($.prototype.ColorPicker).toHaveBeenCalledTimes(1);
                expect($.prototype.ColorPicker).toHaveBeenCalledWith({
                    color: symbol.get('fillColor'),
                    onShow: jasmine.any(Function),
                    onHide: jasmine.any(Function),
                    onChange: jasmine.any(Function)
                });

                //check that the color picker was initialized:
                expect($(".colorpicker").length).toEqual(1);
                expect($('.colorpicker.marker-child-color-picker' + symbol.id).length).toEqual(1);
            });

            it("should listen for vent.trigger('update-opacity')", function () {
                expect(MarkerStyleChildView.prototype.updateSymbolOpacity).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('update-opacity');
                expect(MarkerStyleChildView.prototype.updateSymbolOpacity).toHaveBeenCalledTimes(1);
            });

        });

        describe("MarkerStyleChildView functions:", function () {
            beforeEach(function () {
                jasmine.clock().install();
                initSpies(this);
                initView(this);
            });

            afterEach(function () {
                jasmine.clock().uninstall();
                $(".marker-child-color-picker").remove();
            });

            it("should call updateFillColor when color picker closes", function () {
                spyOn(markerStyleChildView, "updateFillColor").and.callThrough();
                fixture.find('.jscolor').trigger('click');
                $(document).trigger("mousedown");
                jasmine.clock().tick(600);
                expect(markerStyleChildView.updateFillColor).toHaveBeenCalledTimes(1);
            });

            it("updateFillColor should set the model, re-render, and trigger a map update", function () {
                expect(MarkerStyleChildView.prototype.render).toHaveBeenCalledTimes(1);
                expect(MarkerStyleChildView.prototype.onRender).toHaveBeenCalledTimes(1);
                expect(markerStyleChildView.app.vent.trigger).not.toHaveBeenCalledWith('update-map');
                markerStyleChildView.updateFillColor('#EFEFFF');
                expect(markerStyleChildView.model.get("fillColor")).toEqual('#EFEFFF');
                expect(MarkerStyleChildView.prototype.render).toHaveBeenCalledTimes(2);
                expect(MarkerStyleChildView.prototype.onRender).toHaveBeenCalledTimes(2);
                expect(markerStyleChildView.app.vent.trigger).toHaveBeenCalledWith('update-map');
            });

            it("Listens for a shape update and sets the model", function () {
                expect(MarkerStyleChildView.prototype.setSymbol).toHaveBeenCalledTimes(0);
                expect(MarkerStyleChildView.prototype.updateLayerSymbols).toHaveBeenCalledTimes(0);
                fixture.find('.marker-shape').val('worm');
                fixture.find('.marker-shape').trigger('change');
                expect(MarkerStyleChildView.prototype.setSymbol).toHaveBeenCalledTimes(1);
                expect(symbol.get("shape")).toEqual('worm');
            });

            it("updates parent layer when symbol changes", function () {
                spyOn(parentLayer, "setSymbol");
                expect(MarkerStyleChildView.prototype.updateLayerSymbols).toHaveBeenCalledTimes(0);
                expect(parentLayer.setSymbol).toHaveBeenCalledTimes(0);
                symbol.set("shape", "square");
                expect(MarkerStyleChildView.prototype.updateLayerSymbols).toHaveBeenCalledTimes(1);
                expect(parentLayer.setSymbol).toHaveBeenCalledTimes(1);
                expect(parentLayer.setSymbol).toHaveBeenCalledWith(symbol);
            });

            it("updateSymbolOpacity should set the model's symbol opacity and re-render", function () {
                expect(MarkerStyleChildView.prototype.render).toHaveBeenCalledTimes(1);
                expect(MarkerStyleChildView.prototype.onRender).toHaveBeenCalledTimes(1);
                expect(MarkerStyleChildView.prototype.updateSymbolOpacity).toHaveBeenCalledTimes(0);
                markerStyleChildView.app.vent.trigger('update-opacity', 0.22);
                expect(markerStyleChildView.model.get("fillOpacity")).toEqual(0.22);
                expect(MarkerStyleChildView.prototype.render).toHaveBeenCalledTimes(2);
                expect(MarkerStyleChildView.prototype.onRender).toHaveBeenCalledTimes(2);
                expect(MarkerStyleChildView.prototype.updateSymbolOpacity).toHaveBeenCalledTimes(1);
            });



        });
    });
