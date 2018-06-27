var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/right/symbol-style-menu-view",
    "tests/spec-helper1"
],
    function (Backbone, SymbolStyleMenuView) {
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
            spyOn(SymbolStyleMenuView.prototype, 'updateSymbolAttribute').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'showSymbols').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'hideSymbolStyleMenu').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'rebuildMarkersAndSave').and.callThrough();
            spyOn(SymbolStyleMenuView.prototype, 'delayExecution').and.callThrough();

            scope.view = new SymbolStyleMenuView({
                app: scope.app,
                model: scope.categoricalLayer.getSymbols().at(0),
                layer: scope.categoricalLayer
            });
        };

        describe("SymbolStyleMenuView initialization:", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                const symbol = this.categoricalLayer.getSymbols().at(0);
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(symbol);
            });
        });

        describe("SymbolStyleMenuView instance methods work:", function () {
            beforeEach(function () {
                initView(this);
            });

            it('initialize() should work', function () {
                expect(1).toEqual(0);
            });
            it('onRender() should work', function () {
                expect(1).toEqual(0);
            });
            it('updateSymbolTitle() should work', function () {
                expect(1).toEqual(0);
            });
            it('selectText() should work', function () {
                expect(1).toEqual(0);
            });
            it('updateFillColor() should work', function () {
                expect(1).toEqual(0);
            });
            it('updateStrokeColor() should work', function () {
                expect(1).toEqual(0);
            });
            it('updateShape() should work', function () {
                expect(1).toEqual(0);
            });
            it('updateLayerSymbols() should work', function () {
                expect(1).toEqual(0);
            });
            it('updateOpacity() should work', function () {
                expect(1).toEqual(0);
            });
            it('updateStrokeWidth() should work', function () {
                expect(1).toEqual(0);
            });
            it('updateStrokeOpacity() should work', function () {
                expect(1).toEqual(0);
            });
            it('updateSize() should work', function () {
                expect(1).toEqual(0);
            });
            it('updateSymbolAttribute() should work', function () {
                expect(1).toEqual(0);
            });
            it('showSymbols() should work', function () {
                expect(1).toEqual(0);
            });
            it('hideSymbolStyleMenu() should work', function () {
                expect(1).toEqual(0);
            });
            it('rebuildMarkersAndSave() should work', function () {
                expect(1).toEqual(0);
            });
            it('delayExecution() should work', function () {
                expect(1).toEqual(0);
            });
        });
    });
