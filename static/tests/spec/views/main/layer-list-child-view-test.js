var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/left/layer-list-child-view1",
    rootDir + "apps/main/views/left/edit-layer-name-modal-view",
    rootDir + "apps/main/views/left/edit-display-field-modal-view",
    rootDir + "apps/main/views/left/symbol-collection-view",
    rootDir + "apps/main/views/left/symbol-item-view",
    rootDir + "lib/maps/overlays/marker",
    rootDir + "lib/modals/modal",
    rootDir + "models/layer",
    rootDir + "models/record",
    rootDir + "collections/symbols",
    rootDir + "lib/popovers/popover",
    rootDir + "apps/main/views/left/add-marker-menu",
    rootDir + "apps/main/views/left/edit-layer-menu",
    rootDir + "apps/main/views/right/marker-style-view",
    "tests/spec-helper1"
],
    function (Backbone, LayerListChildView, EditLayerName, EditDisplayField,
                SymbolCollectionView, SymbolItemView, MarkerOverlay, Modal,
                Layer, Record, Symbols, Popover, AddMarkerMenu, EditLayerMenu,
                MarkerStyleView) {

        'use strict';

        const initSpies = function(scope) {
            spyOn(LayerListChildView.prototype, 'initialize').and.callThrough();
            spyOn(LayerListChildView.prototype, 'showHideOverlays').and.callThrough();
            spyOn(LayerListChildView.prototype, 'addRecord').and.callThrough();
            spyOn(LayerListChildView.prototype, 'showLayerMenu').and.callThrough();
            spyOn(LayerListChildView.prototype, 'displayGeometryOptions').and.callThrough();
            spyOn(LayerListChildView.prototype, 'render').and.callThrough();
            spyOn(LayerListChildView.prototype, 'onRender').and.callThrough();
            spyOn(LayerListChildView.prototype, 'reRender').and.callThrough();
            spyOn(LayerListChildView.prototype, 'updateGroupBy').and.callThrough();
            spyOn(Marionette.CollectionView.prototype, 'addChild').and.callThrough();
            spyOn(LayerListChildView.prototype, 'addChild').and.callThrough();
            spyOn(LayerListChildView.prototype, 'reRenderOrAssignRecordToSymbol').and.callThrough();
            spyOn(LayerListChildView.prototype, 'reRenderOrReassignRecordToSymbol').and.callThrough();
            spyOn(LayerListChildView.prototype, 'showStyleByMenu').and.callThrough();
            spyOn(LayerListChildView.prototype, 'addCssToSelectedLayer').and.callThrough();
            spyOn(LayerListChildView.prototype, 'collapseSymbols').and.callThrough();
            spyOn(LayerListChildView.prototype, 'saveChanges').and.callThrough();


            spyOn(EditLayerMenu.prototype, 'initialize').and.callThrough();
            spyOn(EditLayerName.prototype, 'initialize').and.callThrough();
            spyOn(EditDisplayField.prototype, 'initialize').and.callThrough();

            spyOn(MarkerStyleView.prototype, 'initialize').and.callThrough();

            spyOn(Record.prototype, "save");
            spyOn(Symbols.prototype, 'removeEmpty');
            spyOn(Symbols.prototype, 'assignRecord').and.callThrough();
            spyOn(Symbols.prototype, 'reassignRecord').and.callThrough();

            spyOn(Modal.prototype, 'show').and.callThrough();
            spyOn(Modal.prototype, 'update').and.callThrough();

            spyOn(MarkerOverlay.prototype, "initialize");
            spyOn(MarkerOverlay.prototype, "redraw");

            spyOn(Popover.prototype, 'update').and.callThrough();
            spyOn(AddMarkerMenu.prototype, 'initialize').and.callThrough();

            // prevent these from being called
            spyOn(SymbolItemView.prototype, 'onDestroy');
            spyOn(SymbolCollectionView.prototype, 'redrawOverlays');
            spyOn(SymbolCollectionView.prototype, 'hideOverlays');
            spyOn(Layer.prototype, 'save');

            spyOn(scope.app.vent, 'trigger').and.callThrough();
            spyOn(scope.app.router, 'navigate');
        };

        const initContinuousLayerView = function(scope) {
            const layer = scope.continuousLayer;
            const records = scope.dataManager.getCollection(layer.get('dataset').overlay_type);
            scope.view = new LayerListChildView({
                app: scope.app,
                model: layer,
                collection: layer.getSymbols(),
                dataCollection: records
            });
        };

        const initCategoricalLayerView = function(scope) {
            const layer = scope.categoricalLayer;
            const records = scope.dataManager.getCollection(layer.get('dataset').overlay_type);
            scope.view = new LayerListChildView({
                app: scope.app,
                model: layer,
                collection: layer.getSymbols(),
                dataCollection: records
            });
        };

        describe("LayerListChildView initialization: ", function () {
            beforeEach(function () {
                initSpies(this);
                initContinuousLayerView(this);
            });

            afterEach(function () {
                $('.popover').remove();
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(this.continuousLayer);
                expect(this.view.collection.length).toEqual(5);
            });

            it("listens for add new record trigger", function () {
                expect(LayerListChildView.prototype.reRenderOrAssignRecordToSymbol).toHaveBeenCalledTimes(0);
                this.view.dataCollection.add(new Backbone.Model());
                expect(LayerListChildView.prototype.reRenderOrAssignRecordToSymbol).toHaveBeenCalledTimes(1);
            });

            it("listens for record collection's record-updated trigger", function () {
                expect(LayerListChildView.prototype.reRenderOrReassignRecordToSymbol).toHaveBeenCalledTimes(0);
                this.view.dataCollection.trigger('record-updated', this.view.dataCollection.at(0));
                expect(LayerListChildView.prototype.reRenderOrReassignRecordToSymbol).toHaveBeenCalledTimes(1);
            });
            it("listens for vent trigger: geometry-created", function () {
                expect(LayerListChildView.prototype.addRecord).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('geometry-created', {});
                expect(LayerListChildView.prototype.addRecord).toHaveBeenCalledTimes(1);

            });
            it("listens for vent trigger: record-has-been-deleted", function () {
                expect(Symbols.prototype.removeEmpty).toHaveBeenCalledTimes(1);
                this.app.vent.trigger('record-has-been-deleted');
                expect(Symbols.prototype.removeEmpty).toHaveBeenCalledTimes(2);
            });

            it('listens for DOM clicks', function () {
                this.view.render();

                //1: When user clicks checkbox, shows / hides overlays
                expect(LayerListChildView.prototype.showHideOverlays).toHaveBeenCalledTimes(1);
                this.view.$el.find('.layer-isShowing').trigger('change');
                expect(LayerListChildView.prototype.showHideOverlays).toHaveBeenCalledTimes(2);

                //2: When user clicks style by, shows showStyleByMenu:
                expect(LayerListChildView.prototype.showStyleByMenu).toHaveBeenCalledTimes(0);
                this.view.$el.find('.layer-style-by').trigger('click');
                expect(LayerListChildView.prototype.showStyleByMenu).toHaveBeenCalledTimes(1);

                //3: When user clicks layer menu button, show layer menu:
                expect(LayerListChildView.prototype.showLayerMenu).toHaveBeenCalledTimes(0);
                this.view.$el.find('.open-layer-menu').trigger('click');
                expect(LayerListChildView.prototype.showLayerMenu).toHaveBeenCalledTimes(1);

                //4: When user clicks the collapse arrow call collapes method:
                expect(LayerListChildView.prototype.collapseSymbols).toHaveBeenCalledTimes(0);
                this.view.$el.find('.collapse').trigger('click');
                expect(LayerListChildView.prototype.collapseSymbols).toHaveBeenCalledTimes(1);

                //5: When user clicks add marker button, show add marker menu:
                expect(LayerListChildView.prototype.displayGeometryOptions).toHaveBeenCalledTimes(0);
                this.view.$el.find('.add-record-container').trigger('click');
                expect(LayerListChildView.prototype.displayGeometryOptions).toHaveBeenCalledTimes(1);

            });

            it('listens for model events', function () {
                const layerModel = this.view.model;
                expect(LayerListChildView.prototype.updateGroupBy).toHaveBeenCalledTimes(0);
                layerModel.set('group_by', 'uniform');
                expect(LayerListChildView.prototype.updateGroupBy).toHaveBeenCalledTimes(1);

                expect(LayerListChildView.prototype.render).toHaveBeenCalledTimes(0);
                layerModel.set('title', 'My New Title');
                expect(LayerListChildView.prototype.render).toHaveBeenCalledTimes(1);

                expect(LayerListChildView.prototype.render).toHaveBeenCalledTimes(1);
                layerModel.set('display_field', 'description');
                expect(LayerListChildView.prototype.render).toHaveBeenCalledTimes(2);
            });

            it('listens for collection events', function () {
                expect(LayerListChildView.prototype.reRender).toHaveBeenCalledTimes(0);
                this.view.collection.reset();
                expect(LayerListChildView.prototype.reRender).toHaveBeenCalledTimes(1);
            });
        });

        describe("LayerListChildView: ", function () {
            beforeEach(function () {
                initSpies(this);
                initContinuousLayerView(this);
            });

            it("should show layer menu when clicked", function () {
                this.view.render();
                expect(Popover.prototype.update).toHaveBeenCalledTimes(0);
                expect(EditLayerMenu.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(LayerListChildView.prototype.showLayerMenu).toHaveBeenCalledTimes(0);

                this.view.$el.find('.open-layer-menu').trigger('click');
                expect(Popover.prototype.update).toHaveBeenCalledTimes(1);
                expect(EditLayerMenu.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(LayerListChildView.prototype.showLayerMenu).toHaveBeenCalledTimes(1);
            });


            it("displayGeometryOptions() works", function() {
                this.view.render();

                expect(Popover.prototype.update).toHaveBeenCalledTimes(0);
                expect(AddMarkerMenu.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(LayerListChildView.prototype.displayGeometryOptions).toHaveBeenCalledTimes(0);

                this.view.$el.find('.add-record-container').trigger('click');
                expect(Popover.prototype.update).toHaveBeenCalledTimes(1);
                expect(AddMarkerMenu.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(LayerListChildView.prototype.displayGeometryOptions).toHaveBeenCalledTimes(1);
            });

            it(".collapse button hides and shows the Symbol Items", function() {
                this.view.render();
                expect(this.view.$el.find('.collapse')).toHaveClass('fa-angle-down');
                this.view.$el.find('.collapse').trigger('click');

                expect(this.view.$el.find('.collapse')).toHaveClass('fa-angle-right');
                expect(this.view.$el.find('.symbols').hasClass('minimize')).toBeTruthy();

                this.view.$el.find('.collapse').trigger('click');

                expect(this.view.$el.find('.collapse')).toHaveClass('fa-angle-down');
                expect(this.view.$el.find('.symbols').hasClass('minimize')).toBeFalsy();
            });

            it("Layer checkbox hides and shows Layer content and icons", function() {
                this.view.render();
                expect(SymbolCollectionView.prototype.redrawOverlays).toHaveBeenCalledTimes(5);
                this.view.$el.find('.layer-isShowing').prop('checked', false).trigger('change');
                expect(this.view.$el[0]).toHaveClass('hide-layer');
                expect(SymbolCollectionView.prototype.hideOverlays).toHaveBeenCalledTimes(5);

                this.view.$el.find('.layer-isShowing').prop('checked', true).trigger('change');
                expect(this.view.$el[0]).not.toHaveClass('hide-layer');
                expect(SymbolCollectionView.prototype.redrawOverlays).toHaveBeenCalledTimes(10);

            });

            it("LayerListChildView recieves notification when a new geometry is completed by the DrawingManager", function () {
                //spyOn(this.app.vent, 'trigger').and.callThrough();
                expect(LayerListChildView.prototype.addRecord).toHaveBeenCalledTimes(0);
                const mockGeometry = {geoJSON: 'mock arg', viewID: 456}
                this.view.app.vent.trigger('geometry-created', mockGeometry);
                expect(LayerListChildView.prototype.addRecord).toHaveBeenCalledTimes(1);
            });


            it("addRecord() works", function() {
                this.view.model.set('geometry', null);
                // set view cid
                this.view.cid  = 456;
                const mockGeometry = {
                    geoJSON: {
                        "type": "Point",
                        "coordinates": [
                            -122.31663275419,
                            38.10623915271
                            ]
                        },
                    viewID: 456
                };

                // wasn't sure how to test the success callback from the save function
                expect(Record.prototype.save).toHaveBeenCalledTimes(0);
                this.view.addRecord(mockGeometry);
                expect(Record.prototype.save).toHaveBeenCalledTimes(1);
            });

            it("reAssignRecordToSymbols() assigns continuous symbols to 'uncategorized' if no category matches", function() {

                const highestSymbol = this.view.collection.models[this.view.collection.models.length-2];
                const uncategorizedSymbol = this.view.collection.models[this.view.collection.models.length-1];
                const record = this.view.dataCollection.get({'id': 18});

                expect(uncategorizedSymbol.matchedModels.length).toEqual(2);
                expect(highestSymbol.matchedModels.contains(record)).toEqual(true);
                expect(uncategorizedSymbol.matchedModels.contains(record)).toEqual(false);

                record.set('height', 100);
                record.trigger('record-updated', record);

                expect(uncategorizedSymbol.matchedModels.length).toEqual(3);
                expect(highestSymbol.matchedModels.contains(record)).toEqual(false);
                expect(uncategorizedSymbol.matchedModels.contains(record)).toEqual(true);


            });

            it("'styled by: ' text updates when the Layer's 'group_by' attribute changes", function() {
                this.view.render();
                expect(this.view.model.get('group_by')).toEqual('height');
                expect(this.view.$el.find('.layer-style-by').text()).toEqual('height');
                expect(this.view.$el.find('.collapse').css('visibility')).toEqual('visible');

                this.view.model.set('group_by', 'individual');

                expect(this.view.$el.find('.layer-style-by').text()).toEqual('individual');
                expect(this.view.$el.find('.collapse').css('visibility')).toEqual('hidden');
            });
        });
        describe("LayerListChildView, categorical: ", function () {
            beforeEach(function () {
                initSpies(this);
                initCategoricalLayerView(this);
            });

        });

        describe('LayerListChildView: instance methods work', function () {
            beforeEach(function () {
                initSpies(this);
            });
            afterEach(function () {
                $('.popover').remove();
            });

            it('onRender() works', function () {
                initCategoricalLayerView(this);
                expect(LayerListChildView.prototype.showHideOverlays).toHaveBeenCalledTimes(0);
                this.view.render();
                expect(LayerListChildView.prototype.showHideOverlays).toHaveBeenCalledTimes(1);

            });
            it('reRender() works', function () {
                initCategoricalLayerView(this);
                spyOn(Symbols.prototype, 'assignRecords').and.callThrough();
                expect(Symbols.prototype.assignRecords).toHaveBeenCalledTimes(0);
                this.view.reRender();
                expect(Symbols.prototype.assignRecords).toHaveBeenCalledTimes(1);
                expect(Symbols.prototype.assignRecords).toHaveBeenCalledWith(this.view.dataCollection);
            });

            it('updateGroupBy() works', function () {
                initCategoricalLayerView(this);
                this.view.render();
                expect(LayerListChildView.prototype.updateGroupBy).toHaveBeenCalledTimes(0);

                // set a different categorical group by:
                this.view.model.set('group_by', 'id');
                expect(LayerListChildView.prototype.updateGroupBy).toHaveBeenCalledTimes(1);
                expect(this.view.$el.find('.layer-style-by').html()).toEqual('id');
                expect(this.view.$el.find('.collapse').css('visibility')).toEqual('visible');

                // set to individual and make sure expand / contract arrow invisible:
                this.view.model.set('group_by', 'individual');
                expect(LayerListChildView.prototype.updateGroupBy).toHaveBeenCalledTimes(2);
                expect(this.view.$el.find('.layer-style-by').html()).toEqual('individual');
                expect(this.view.$el.find('.collapse').css('visibility')).toEqual('hidden');

            });

            it('addChild() does not omit empty continuous symbol', function () {
                expect(Marionette.CollectionView.prototype.addChild).toHaveBeenCalledTimes(0);
                expect(LayerListChildView.prototype.addChild).toHaveBeenCalledTimes(0);
                initContinuousLayerView(this);
                this.view.model.getSymbols().at(0).matchedModels = new Backbone.Collection();
                this.view.render();
                let counter = 0;
                let numRecords = 0;
                this.view.model.getSymbols().each(symbol => {
                    if (!symbol.isEmpty()) {
                        ++counter;
                        numRecords += symbol.getModels().length;
                    }
                });
                expect(LayerListChildView.prototype.addChild).toHaveBeenCalledTimes(this.view.model.getSymbols().length);
                expect(Marionette.CollectionView.prototype.addChild).toHaveBeenCalledTimes(numRecords + counter + 1);
            });

            it('addChild() omits empty categorical symbol', function () {
                expect(Marionette.CollectionView.prototype.addChild).toHaveBeenCalledTimes(0);
                expect(LayerListChildView.prototype.addChild).toHaveBeenCalledTimes(0);
                initCategoricalLayerView(this);
                this.view.model.getSymbols().at(0).matchedModels = new Backbone.Collection();
                this.view.render();
                let counter = 0;
                let numRecords = 0;
                this.view.model.getSymbols().each(symbol => {
                    if (!symbol.isEmpty()) {
                        ++counter;
                        numRecords += symbol.getModels().length;
                    }
                });
                expect(LayerListChildView.prototype.addChild).toHaveBeenCalledTimes(this.view.model.getSymbols().length);
                expect(Marionette.CollectionView.prototype.addChild).toHaveBeenCalledTimes(numRecords + counter);
            });
            it('reRenderOrAssignRecordToSymbol(recordModel) works', function () {
                initCategoricalLayerView(this);
                const record = this.view.dataCollection.at(0);
                expect(LayerListChildView.prototype.render).toHaveBeenCalledTimes(0);
                expect(Symbols.prototype.assignRecord).toHaveBeenCalledTimes(18);
                this.view.reRenderOrAssignRecordToSymbol(record);
                expect(LayerListChildView.prototype.render).toHaveBeenCalledTimes(0);
                expect(Symbols.prototype.assignRecord).toHaveBeenCalledWith(record);
                expect(Symbols.prototype.assignRecord).toHaveBeenCalledTimes(19);
            });
            it('reRenderOrReassignRecordToSymbol() works', function () {
                initCategoricalLayerView(this);
                const record = this.view.dataCollection.at(0);
                expect(LayerListChildView.prototype.render).toHaveBeenCalledTimes(0);
                expect(Symbols.prototype.reassignRecord).toHaveBeenCalledTimes(0);
                this.view.reRenderOrReassignRecordToSymbol(record);
                expect(LayerListChildView.prototype.render).toHaveBeenCalledTimes(0);
                expect(Symbols.prototype.reassignRecord).toHaveBeenCalledWith(record);

            });
            it('showStyleByMenu() works', function () {
                initCategoricalLayerView(this);
                expect(MarkerStyleView.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(Popover.prototype.update).toHaveBeenCalledTimes(0);
                this.view.render();
                this.view.showStyleByMenu();
                expect(MarkerStyleView.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(Popover.prototype.update).toHaveBeenCalledTimes(1);
            });
            it('displayGeometryOptions() works', function () {
                initCategoricalLayerView(this);
                expect(AddMarkerMenu.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(Popover.prototype.update).toHaveBeenCalledTimes(0);
                this.view.render();
                this.view.displayGeometryOptions();
                expect(AddMarkerMenu.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(Popover.prototype.update).toHaveBeenCalledTimes(1);
            });
            it('addCssToSelectedLayer() works', function () {
                initCategoricalLayerView(this);
                const record = this.view.dataCollection.at(0);
                expect(this.view.$el.find('#' + record.id).hasClass('highlight')).toBeFalsy();
                this.view.render();
                this.view.addCssToSelectedLayer(record.id);
                expect(this.view.$el.find('#' + record.id).hasClass('highlight')).toBeTruthy();
            });
            it('collapseSymbols() works', function () {
                initCategoricalLayerView(this);
                this.view.model.get('metadata').collapsed = false;
                this.view.render();
                const $el = this.view.$el;
                expect(this.view.model.get('metadata').collapsed).toBeFalsy();

                //minimize:
                this.view.collapseSymbols();
                expect(this.view.model.get('metadata').collapsed).toBeTruthy();
                expect($el.find('.symbols').hasClass('minimize')).toBeTruthy();
                expect($el.find('.collapse').hasClass('fa-angle-down')).toBeFalsy();
                expect($el.find('.collapse').hasClass('fa-angle-right')).toBeTruthy();

                //maximize:
                this.view.collapseSymbols();
                expect(this.view.model.get('metadata').collapsed).toBeFalsy();
                expect($el.find('.symbols').hasClass('minimize')).toBeFalsy();
                expect($el.find('.collapse').hasClass('fa-angle-down')).toBeTruthy();
                expect($el.find('.collapse').hasClass('fa-angle-right')).toBeFalsy();
            });

            it('saveChanges() works', function () {
                initCategoricalLayerView(this);
                expect(Layer.prototype.save).toHaveBeenCalledTimes(0);
                this.view.saveChanges();
                expect(Layer.prototype.save).toHaveBeenCalledTimes(1);
            });
        });
    });
