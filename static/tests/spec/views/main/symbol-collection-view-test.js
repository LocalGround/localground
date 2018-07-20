var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/left/symbol-collection-view",
    "tests/spec-helper1"
],
    function (Backbone, SymbolCollectionView) {
        'use strict';
        var map, layer, symbol;

        const initView = function (scope) {
            spyOn(SymbolCollectionView.prototype, 'initialize').and.callThrough();
            spyOn(SymbolCollectionView.prototype, 'showHideOverlays').and.callThrough();
            spyOn(SymbolCollectionView.prototype, 'redrawOverlays').and.callThrough();

            map = scope.dataManager.getMaps().at(0);
            layer = scope.getLayers(map.id).at(1);
            symbol = layer.get('symbols').models[0];
            scope.view = new SymbolCollectionView({
                app: scope.app,
                model: symbol,
                layer: layer
            });
            console.log(scope.app);
            console.log(symbol);
        };

        describe("SymbolCollectionView: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(symbol);
            });
        });

        describe("SymbolCollectionView: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should show/hide symbol when eye-icon is clicked", function () {
                this.view.render();
            
                expect(SymbolCollectionView.prototype.showHideOverlays).toHaveBeenCalledTimes(0);
                expect(SymbolCollectionView.prototype.redrawOverlays).toHaveBeenCalledTimes(0);
                expect(this.view.$el.find('.symbol-display')).toHaveClass('fa-eye');
                expect(this.view.$el.find('.symbol-display')).not.toHaveClass('fa-eye-slash');
                expect(this.view.$el).not.toHaveClass('half-opac');
                expect(this.view.model.get('isShowing')).toEqual(true);

                this.view.$el.find('.symbol-display').trigger('click');
                expect(SymbolCollectionView.prototype.showHideOverlays).toHaveBeenCalledTimes(1);
                expect(SymbolCollectionView.prototype.redrawOverlays).toHaveBeenCalledTimes(1);
                expect(this.view.$el.find('.symbol-display')).toHaveClass('fa-eye-slash');
                expect(this.view.$el.find('.symbol-display')).not.toHaveClass('fa-eye');
                expect(this.view.$el).toHaveClass('half-opac');
                expect(this.view.model.get('isShowing')).toEqual(false);
                //expect('')


                this.view.$el.find('.symbol-display').trigger('click');
                expect(SymbolCollectionView.prototype.showHideOverlays).toHaveBeenCalledTimes(2);
                expect(SymbolCollectionView.prototype.redrawOverlays).toHaveBeenCalledTimes(2);
                expect(this.view.$el.find('.symbol-display')).toHaveClass('fa-eye');
                expect(this.view.$el.find('.symbol-display')).not.toHaveClass('fa-eye-slash');
                expect(this.view.$el).not.toHaveClass('half-opac');
                expect(this.view.model.get('isShowing')).toEqual(true);


            });
        });
    });
