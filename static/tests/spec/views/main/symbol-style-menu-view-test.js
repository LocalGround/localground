var rootDir = "../../../";
define([
    "backbone",
    rootDir + "models/layer",
    rootDir + "apps/main/views/right/symbol-style-menu-view",
    "tests/spec-helper1"
],
    function (Backbone, Layer, SymbolStyleMenuView) {
        'use strict';
        var map, layer, symbol;

        const initView = function (scope) {
            spyOn(SymbolStyleMenuView.prototype, 'initialize').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'onRender').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'updateSymbolTitle').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'selectText').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'updateFillColor').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'updateStrokeColor').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'updateShape').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'updateLayerSymbols').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'updateOpacity').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'updateStrokeWidth').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'updateStrokeOpacity').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'updateSize').and.callThrough();
            spyOn(Layer.prototype, 'save').and.callThrough();

            scope.symbol = scope.categoricalLayer.getSymbols().at(0);
            scope.view = new SymbolStyleMenuView({
                app: scope.app,
                model: scope.symbol,
                layer: scope.categoricalLayer
            });
            scope.view.render();
        };

        describe("SymbolStyleMenuView initialization:", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(this.symbol);
            });

            it("listens for shape changes", function () {
                expect(this.view.updateShape).toHaveBeenCalledTimes(0);
                this.view.$el.find('.style-menu_shape-wrapper').trigger('click');
                expect(this.view.updateShape).toHaveBeenCalledTimes(1);
            });

            it("listens for size changes", function () {
                expect(this.view.updateSize).toHaveBeenCalledTimes(0);
                this.view.$el.find('#marker-width').trigger('change');
                expect(this.view.updateSize).toHaveBeenCalledTimes(1);
            });

            it("listens for opacity changes", function () {
                expect(this.view.updateOpacity).toHaveBeenCalledTimes(0);
                this.view.$el.find('#marker-opacity').trigger('change');
                expect(this.view.updateOpacity).toHaveBeenCalledTimes(1);
            });

            it("listens for stroke width changes", function () {
                expect(this.view.updateStrokeWidth).toHaveBeenCalledTimes(0);
                this.view.$el.find('#stroke-weight').trigger('change');
                expect(this.view.updateStrokeWidth).toHaveBeenCalledTimes(1);
            });

            it("listens for stroke opacity changes", function () {
                expect(this.view.updateStrokeOpacity).toHaveBeenCalledTimes(0);
                this.view.$el.find('#stroke-opacity').trigger('change');
                expect(this.view.updateStrokeOpacity).toHaveBeenCalledTimes(1);
            });

            it("listens for shape changes", function () {
                expect(this.view.updateSymbolTitle).toHaveBeenCalledTimes(0);
                this.view.$el.find('.symbol-title-input').trigger('focusout');
                expect(this.view.updateSymbolTitle).toHaveBeenCalledTimes(1);
            });

            it("listens for shape changes", function () {
                expect(this.view.selectText).toHaveBeenCalledTimes(0);
                this.view.$el.find('.symbol-title-input').trigger('click');
                expect(this.view.selectText).toHaveBeenCalledTimes(1);
            });

            it("listens for model events", function () {
                expect(this.view.updateLayerSymbols).toHaveBeenCalledTimes(0);
                this.symbol.set('fillColor', 'white');
                this.symbol.set('strokeColor', 'white');
                this.symbol.set('shape', 'pin');
                this.symbol.set('width', 30);
                this.symbol.set('markerSize', 30);
                this.symbol.set('fillOpacity', 0.5);
                this.symbol.set('strokeOpacity', 0.5);
                this.symbol.set('strokeWeight', 3);
                this.symbol.set('title', 'Hi');
                expect(this.view.updateLayerSymbols).toHaveBeenCalledTimes(9);
            })
        });

        describe("SymbolStyleMenuView instance methods work:", function () {
            beforeEach(function () {
                initView(this);
            });
            it('updateSymbolTitle() should work', function () {
                expect(this.view.updateLayerSymbols).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                this.view.$el.find('.symbol-title-input').val('Hi there!');
                this.view.updateSymbolTitle();
                expect(this.view.model.get('title')).toEqual('Hi there!');
                expect(this.view.$el.find('.symbol-title-input').val()).toEqual('Hi there!');
                expect(this.view.updateLayerSymbols).toHaveBeenCalledTimes(1);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });
            it('updateFillColor(color) should work', function () {
                expect(this.view.updateLayerSymbols).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                this.view.updateFillColor('red');
                expect(this.view.model.get('fillColor')).toEqual('red');
                expect(this.view.$el.find('#fill-color-picker').css('background')).toEqual('red');
                expect(this.view.updateLayerSymbols).toHaveBeenCalledTimes(1);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });
            it('updateStrokeColor() should work', function () {
                expect(this.view.updateLayerSymbols).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                this.view.updateStrokeColor('red');
                expect(this.view.model.get('strokeColor')).toEqual('red');
                expect(this.view.$el.find('#stroke-color-picker').css('background')).toEqual('red');
                expect(this.view.updateLayerSymbols).toHaveBeenCalledTimes(1);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });
            it('updateShape() should work', function () {
                const selector = '.style-menu_shape-wrapper[data-shape*="square"]';
                expect(this.view.updateShape).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                expect(this.view.$el.find(selector).hasClass('selected-shape')).toBeFalsy();
                this.view.$el.find(selector).trigger('click');
                expect(this.view.model.get('shape')).toEqual('square');
                expect(this.view.$el.find(selector).hasClass('selected-shape')).toBeTruthy();
                expect(this.view.updateShape).toHaveBeenCalledTimes(1);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });
            it('updateLayerSymbols() should work', function () {
                expect(this.view.layer.save).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                this.view.updateLayerSymbols()
                expect(this.view.layer.save).toHaveBeenCalledTimes(1);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });
            it('updateOpacity() > 1 should work', function () {
                expect(this.view.updateOpacity).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                this.view.$el.find('#marker-opacity').val(0.5);
                this.view.$el.find('#marker-opacity').trigger('change');
                expect(this.view.model.get('fillOpacity')).toEqual(0.5);
                expect(this.view.$el.find('#marker-opacity').val()).toEqual('0.5');
                expect(this.view.updateOpacity).toHaveBeenCalledTimes(1);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });
            it('updateStrokeWidth() should work', function () {
                expect(this.view.updateStrokeWidth).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                this.view.$el.find('#stroke-weight').val(3);
                this.view.$el.find('#stroke-weight').trigger('change');
                expect(this.view.model.get('strokeWeight')).toEqual(3);
                expect(this.view.$el.find('#stroke-weight').val()).toEqual('3');
                expect(this.view.updateStrokeWidth).toHaveBeenCalledTimes(1);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });
            it('updateStrokeOpacity() should work', function () {
                expect(this.view.updateStrokeOpacity).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                this.view.$el.find('#stroke-opacity').val(0.6);
                this.view.$el.find('#stroke-opacity').trigger('change');
                expect(this.view.model.get('strokeOpacity')).toEqual(0.6);
                expect(this.view.$el.find('#stroke-opacity').val()).toEqual('0.6');
                expect(this.view.updateStrokeOpacity).toHaveBeenCalledTimes(1);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });
            it('updateSize() should work', function () {
                expect(this.view.updateSize).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                this.view.$el.find('#marker-width').val(50);
                this.view.$el.find('#marker-width').trigger('change');
                expect(this.view.model.get('width')).toEqual(50);
                expect(this.view.updateSize).toHaveBeenCalledTimes(1);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });
        });
    });
