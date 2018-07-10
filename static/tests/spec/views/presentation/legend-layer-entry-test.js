var rootDir = "../../../";
define([
    "backbone",
    rootDir + "lib/maps/overlays/marker",
    rootDir + "lib/maps/marker-overlays",
    rootDir + "apps/presentation/views/legend-layer-entry"
],
    function (Backbone, MarkerOverlay, MarkerOverlays, LegendLayerEntry) {
        'use strict';
        let map, layer, symbol, symbols;
        const initView = function (scope) {
            spyOn(LegendLayerEntry.prototype, 'initialize').and.callThrough();
            spyOn(LegendLayerEntry.prototype, 'onRender').and.callThrough();
            spyOn(LegendLayerEntry.prototype, 'collapseSymbols').and.callThrough();
            spyOn(LegendLayerEntry.prototype, 'expandSymbols').and.callThrough();
            
            

            // needed to prevent problems with overlays
            spyOn(MarkerOverlay.prototype, 'initialize');
            spyOn(MarkerOverlay.prototype, 'redraw');
            spyOn(MarkerOverlay.prototype, 'show');
            spyOn(MarkerOverlay.prototype, 'hide');

            spyOn(MarkerOverlays.prototype, 'showAll');
            spyOn(MarkerOverlays.prototype, 'hideAll');
         


            map = scope.dataManager.getMaps().at(0);
            layer = scope.getLayers(map.id).at(1);
            symbols = layer.getSymbols();

            const records = scope.dataManager.getCollection(
                scope.layer.get('dataset').overlay_type
            )
            console.log(records);
            // symbols.assignRecords(records);

            // symbol = symbols.models[1];


            scope.view = new LegendLayerEntry({
                app: scope.presentationApp,
                model: layer,
                collection: symbols,
                dataCollection: records
            });

            scope.view.render();
        };

        describe("LegendLayerEntry: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(layer);
                expect(this.view.collection).toEqual(symbols);
            });

            it("onRender() works", function () {
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                expect(this.view.collapseSymbols).toHaveBeenCalledTimes(1);
            });

            it("expandSymbols() works", function () {
                expect(this.view.$el.find('.presentation-records_wrapper').css('display')).toEqual('none');
                expect(this.view.$el.find('.collapse')).toHaveClass('fa-angle-right');
                expect(this.view.$el.find('.collapse')).not.toHaveClass('fa-angle-down');
                expect(this.view.$el.find('.symbol-entry-header')).toHaveClass('legend-symbol_collapsed');
                expect(this.view.$el.find('.symbol-entry-header')).not.toHaveClass('legend-symbol_expanded');

                this.view.expandSymbols();

                expect(this.view.$el.find('.presentation-records_wrapper').css('display')).toEqual('block');
                expect(this.view.$el.find('.collapse')).not.toHaveClass('fa-angle-right');
                expect(this.view.$el.find('.collapse')).toHaveClass('fa-angle-down');
                expect(this.view.$el.find('.symbol-entry-header')).not.toHaveClass('legend-symbol_collapsed');
                expect(this.view.$el.find('.symbol-entry-header')).toHaveClass('legend-symbol_expanded');
            });

            it("collapseSymbols() works", function () {

                this.view.expandSymbols();

                expect(this.view.$el.find('.presentation-records_wrapper').css('display')).toEqual('block');
                expect(this.view.$el.find('.collapse')).not.toHaveClass('fa-angle-right');
                expect(this.view.$el.find('.collapse')).toHaveClass('fa-angle-down');
                expect(this.view.$el.find('.symbol-entry-header')).not.toHaveClass('legend-symbol_collapsed');
                expect(this.view.$el.find('.symbol-entry-header')).toHaveClass('legend-symbol_expanded');

                this.view.collapseSymbols();

                expect(this.view.$el.find('.presentation-records_wrapper').css('display')).toEqual('none');
                expect(this.view.$el.find('.collapse')).toHaveClass('fa-angle-right');
                expect(this.view.$el.find('.collapse')).not.toHaveClass('fa-angle-down');
                expect(this.view.$el.find('.symbol-entry-header')).toHaveClass('legend-symbol_collapsed');
                expect(this.view.$el.find('.symbol-entry-header')).not.toHaveClass('legend-symbol_expanded');
            });

            it("expandCollapseSymbols() works", function () {

                expect(this.view.collapseSymbols).toHaveBeenCalledTimes(1);
                expect(this.view.expandSymbols).toHaveBeenCalledTimes(0);

                this.view.$el.find('.collapse').click();

                expect(this.view.collapseSymbols).toHaveBeenCalledTimes(1);
                expect(this.view.expandSymbols).toHaveBeenCalledTimes(1);
                
                this.view.$el.find('.collapse').click();

                expect(this.view.collapseSymbols).toHaveBeenCalledTimes(2);
                expect(this.view.expandSymbols).toHaveBeenCalledTimes(1);

            });

            it("showHideLayer() works", function () {
                
                this.view.$el.find('.cb-symbol').prop('checked', false).change();
                // hide all 5 symbols
                expect(MarkerOverlays.prototype.hideAll).toHaveBeenCalledTimes(5);
                expect(MarkerOverlays.prototype.showAll).toHaveBeenCalledTimes(0);
                expect(this.view.$el.find('.symbol-container').css('display')).toEqual('none');
                expect(this.view.$el.find('.collapse').css('visibility')).toEqual('hidden');


                this.view.$el.find('.cb-symbol').prop('checked', true).change();
                // show all 5 symbols except the one's that are individually hidden 
                //(so show 4 out of 5)
                expect(MarkerOverlays.prototype.hideAll).toHaveBeenCalledTimes(5);
                expect(MarkerOverlays.prototype.showAll).toHaveBeenCalledTimes(4);
                expect(this.view.$el.find('.symbol-container').css('display')).toEqual('block');
                expect(this.view.$el.find('.collapse').css('visibility')).toEqual('visible');



                this.view.$el.find('.cb-symbol').prop('checked', false).change();
                // hide all 5 symbols
                expect(MarkerOverlays.prototype.hideAll).toHaveBeenCalledTimes(10);
                expect(MarkerOverlays.prototype.showAll).toHaveBeenCalledTimes(4);
                expect(this.view.$el.find('.symbol-container').css('display')).toEqual('none');
                expect(this.view.$el.find('.collapse').css('visibility')).toEqual('hidden');

                
                this.view.$el.find('.cb-symbol').prop('checked', true).change();
                // show all 5 symbols except the one's that are individually hidden 
                //(so show 4 out of 5)
                expect(MarkerOverlays.prototype.hideAll).toHaveBeenCalledTimes(10);
                expect(MarkerOverlays.prototype.showAll).toHaveBeenCalledTimes(8);
                expect(this.view.$el.find('.symbol-container').css('display')).toEqual('block');
                expect(this.view.$el.find('.collapse').css('visibility')).toEqual('visible');
               
            });
        });
        
    });