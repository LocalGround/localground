var rootDir = "../../../";
define([
    "backbone",
    rootDir + "lib/maps/overlays/marker",
    rootDir + "apps/presentation/views/legend-symbol-entry"
],
    function (Backbone, MarkerOverlay, LegendSymbolEntry) {
        'use strict';
        let map, layer, symbol;
        const initView = function (scope) {
            spyOn(LegendSymbolEntry.prototype, 'initialize').and.callThrough();
            spyOn(LegendSymbolEntry.prototype, 'onRender').and.callThrough();
            spyOn(LegendSymbolEntry.prototype, 'addHiddenCSS').and.callThrough();
            spyOn(LegendSymbolEntry.prototype, 'removeHiddenCSS').and.callThrough();
            spyOn(LegendSymbolEntry.prototype, 'showHideOverlays').and.callThrough();
            spyOn(LegendSymbolEntry.prototype, 'hide').and.callThrough();
            spyOn(LegendSymbolEntry.prototype, 'show').and.callThrough();
            spyOn(LegendSymbolEntry.prototype, 'handleRoute').and.callThrough();
            spyOn(LegendSymbolEntry.prototype, 'activateMapMarker').and.callThrough();
            

            // spyOn(scope.app.vent, 'trigger');
            // spyOn(scope.app.router, 'navigate');
            // spyOn(LegendSymbolEntry.prototype, 'initialize');
            // spyOn(LegendSymbolEntry.prototype, 'render');

            // needed to prevent problems with overlays
            spyOn(MarkerOverlay.prototype, "initialize");
            spyOn(MarkerOverlay.prototype, "redraw");
            spyOn(MarkerOverlay.prototype, "show");
            spyOn(MarkerOverlay.prototype, "hide");
            spyOn(MarkerOverlay.prototype, "activate").and.callThrough();
            spyOn(MarkerOverlay.prototype, "deactivate").and.callThrough();

            map = scope.dataManager.getMaps().at(0);
            layer = scope.getLayers(map.id).at(1);
            console.log(layer.get('symbols'));
            const symbols = layer.getSymbols();

            const records = scope.dataManager.getCollection(
                scope.layer.get('dataset').overlay_type
            )
            symbols.assignRecords(records);

            symbol = symbols.models[1];

            console.log(layer.get('symbols').models.length);
            console.log(layer.get("dataset"));
            console.log(layer.get("metadata").isShowing);

            scope.view = new LegendSymbolEntry({
                app: scope.presentationApp,
                model: symbol,
                symbolCount: layer.get('symbols').models.length,
                dataset: layer.get("dataset"),
                isShowing: layer.get("metadata").isShowing
            });

            scope.view.render();


            console.log(symbol.getModels());
            console.log(symbol);
            console.log(scope.view);

        };

        describe("LegendSymbolEntry: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(symbol);
                expect(this.view.markerOverlays.collection.length).toEqual(3);
                expect(this.view.activeRecordId).toEqual(null);
                expect(this.view.activeLayerId).toEqual(null);
                expect(this.view.model.collection.length).toEqual(5);
                expect(this.view.$el.find('.presentation-record_item').length).toEqual(3);
            });

            it('onRender() should work', function() {
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                expect(this.view.addHiddenCSS).toHaveBeenCalledTimes(0);
                
                this.view.model.set('isShowing', false);

                this.view.render();

                expect(this.view.onRender).toHaveBeenCalledTimes(2);
                expect(this.view.addHiddenCSS).toHaveBeenCalledTimes(1);
            });

            it('getRecordDisplayInfo() is correct', function() {
                const infoList = this.view.getRecordDisplayInfo(this.view.model.matchedModels);
                const item1 = infoList[0];
                const item2 = infoList[1];

                expect(infoList.length).toEqual(3);

                expect(item1.itemId).toEqual('63/10');
                expect(item1.displayText).toEqual(30);
                expect(item1.url).toEqual('#/layers/63/dataset_2/10');

                expect(item2.itemId).toEqual('63/12');
                expect(item2.displayText).toEqual(21);
                expect(item2.url).toEqual('#/layers/63/dataset_2/12');
            });

            it('showHideOverlays() is correct', function() {

                expect(this.view.showHideOverlays).toHaveBeenCalledTimes(0);

                expect(this.view.addHiddenCSS).toHaveBeenCalledTimes(0);
                expect(this.view.hide).toHaveBeenCalledTimes(0);
                expect(this.view.show).toHaveBeenCalledTimes(0);
                expect(this.view.removeHiddenCSS).toHaveBeenCalledTimes(0);

                expect(this.view.model.get('isShowing')).toEqual(true);
                
                //this.view.showHideOverlays();
                this.view.$el.find('.legend-show_symbol').click();

                expect(this.view.showHideOverlays).toHaveBeenCalledTimes(1);

                expect(this.view.addHiddenCSS).toHaveBeenCalledTimes(1);
                expect(this.view.hide).toHaveBeenCalledTimes(1);
                expect(this.view.show).toHaveBeenCalledTimes(0);
                expect(this.view.removeHiddenCSS).toHaveBeenCalledTimes(0);
                expect(this.view.model.get('isShowing')).toEqual(false);


                this.view.$el.find('.legend-show_symbol').click();

                expect(this.view.showHideOverlays).toHaveBeenCalledTimes(2);

                expect(this.view.addHiddenCSS).toHaveBeenCalledTimes(1);
                expect(this.view.hide).toHaveBeenCalledTimes(1);
                expect(this.view.show).toHaveBeenCalledTimes(1);
                expect(this.view.removeHiddenCSS).toHaveBeenCalledTimes(1);
                expect(this.view.model.get('isShowing')).toEqual(true);

            });

            it('addHiddenCSS() is correct', function() {

                expect(this.view.$el).not.toHaveClass('half-opac');
                expect(this.view.$el.find('.legend-show_symbol')).toHaveClass('fa-eye');
                expect(this.view.$el.find('.legend-show_symbol')).not.toHaveClass('fa-eye-slash');

                this.view.addHiddenCSS();

                expect(this.view.$el).toHaveClass('half-opac');
                expect(this.view.$el.find('.legend-show_symbol')).not.toHaveClass('fa-eye');
                expect(this.view.$el.find('.legend-show_symbol')).toHaveClass('fa-eye-slash');
            });

            it('removeHiddenCSS() is correct', function() {

                this.view.addHiddenCSS();

                expect(this.view.$el).toHaveClass('half-opac');
                expect(this.view.$el.find('.legend-show_symbol')).not.toHaveClass('fa-eye');
                expect(this.view.$el.find('.legend-show_symbol')).toHaveClass('fa-eye-slash');

                this.view.removeHiddenCSS();

                expect(this.view.$el).not.toHaveClass('half-opac');
                expect(this.view.$el.find('.legend-show_symbol')).toHaveClass('fa-eye');
                expect(this.view.$el.find('.legend-show_symbol')).not.toHaveClass('fa-eye-slash');
            });

            it('handleRoute() is works with matching route info', function() {

                expect(this.view.handleRoute).toHaveBeenCalledTimes(0);
                expect(this.view.activateMapMarker).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                expect(this.view.activeRecordId).toEqual(null);
                expect(this.view.activeRecordId).toEqual(null);

                const matchingInfo = {
                    dataType: 'dataset_2',
                    id: 12,
                    layerId: 63
                }

                this.app.vent.trigger('show-detail', matchingInfo);

                expect(this.view.handleRoute).toHaveBeenCalledTimes(1);

                expect(this.view.handleRoute).toHaveBeenCalledWith(matchingInfo);

                expect(this.view.activeRecordId).toEqual(12);
                expect(this.view.activeLayerId).toEqual(63);
                expect(this.view.activateMapMarker).toHaveBeenCalledTimes(1);
                expect(this.view.activateMapMarker).toHaveBeenCalledWith(matchingInfo);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });

            it('handleRoute() is works with nonmatching route info', function() {

                expect(this.view.handleRoute).toHaveBeenCalledTimes(0);
                expect(this.view.activateMapMarker).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(1);
                expect(this.view.activeRecordId).toEqual(null);
                expect(this.view.activeRecordId).toEqual(null);

                // info that does not match any records listed in test symbol
                const nonmatchingInfo = {
                    dataType: 'dataset_2',
                    id: 30,
                    layerId: 63
                }

                this.app.vent.trigger('show-detail', nonmatchingInfo);

                expect(this.view.handleRoute).toHaveBeenCalledTimes(1);

                expect(this.view.handleRoute).toHaveBeenCalledWith(nonmatchingInfo);

                expect(this.view.activeRecordId).toEqual(30);
                expect(this.view.activeLayerId).toEqual(63);
                expect(this.view.activateMapMarker).toHaveBeenCalledTimes(0);
                expect(this.view.onRender).toHaveBeenCalledTimes(2);
            });

            it('activateMapMarker() is works', function() {
                const info1 = {
                    dataType: 'dataset_2',
                    id: 12,
                    layerId: 63
                }

                this.view.activateMapMarker(info1);
                console.log(this.view.app.activeMapMarker);
                console.log(this.view.app.activeMapMarker.active);
                expect(this.view.app.activeMapMarker.model.id).toEqual(12);
                expect(MarkerOverlay.prototype.activate).toHaveBeenCalledTimes(1);
                expect(MarkerOverlay.prototype.deactivate).toHaveBeenCalledTimes(0);

            });



        });
        
    });
