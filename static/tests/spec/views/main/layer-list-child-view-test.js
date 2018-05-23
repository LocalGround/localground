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
    "tests/spec-helper1"
],
    function (Backbone, LayerListChildView, EditLayerName, EditDisplayField, SymbolCollectionView, SymbolItemView, MarkerOverlay, Modal) {
        'use strict';
        var map;

        const initSpies = function(scope) {
            spyOn(LayerListChildView.prototype, 'initialize').and.callThrough();
            spyOn(LayerListChildView.prototype, 'showHideOverlays').and.callThrough();
            spyOn(LayerListChildView.prototype, 'initAddPoint').and.callThrough();
            spyOn(LayerListChildView.prototype, 'initAddPolygon').and.callThrough();
            spyOn(LayerListChildView.prototype, 'initAddPolyline').and.callThrough();
            spyOn(LayerListChildView.prototype, 'notifyDrawingManager').and.callThrough();
            spyOn(LayerListChildView.prototype, 'addRecord').and.callThrough();
            spyOn(LayerListChildView.prototype, 'reAssignRecordsToSymbols');
            spyOn(LayerListChildView.prototype, 'reAssignRecordToSymbols').and.callThrough();
            spyOn(LayerListChildView.prototype, 'removeEmptySymbols').and.callThrough();

            spyOn(EditLayerName.prototype, 'initialize').and.callThrough();
            spyOn(EditDisplayField.prototype, 'initialize').and.callThrough();
            spyOn(Modal.prototype, 'show').and.callThrough();
            spyOn(Modal.prototype, 'update').and.callThrough();
            spyOn(MarkerOverlay.prototype, "initialize");
            spyOn(MarkerOverlay.prototype, "redraw");

            // prevent these from being called
            spyOn(SymbolItemView.prototype, 'onDestroy');
            spyOn(SymbolCollectionView.prototype, 'redrawOverlays');
            spyOn(SymbolCollectionView.prototype, 'hideOverlays');

            spyOn(scope.app.vent, 'trigger').and.callThrough();
            spyOn(scope.app.router, 'navigate');
        };

        const initContinuousLayerView = function(scope) {
            map = scope.dataManager.getMaps().at(0);

            map.set("layers", scope.getLayers(map.id));
            //console.log(map);
            const layer = map.get('layers').at(1);
            scope.view = new LayerListChildView({
                app: scope.app,
                model: layer,
                collection: layer.get('symbols'),
                dataCollection: scope.dataManager.getCollection(layer.get('dataset').overlay_type)
            });
        };

        const initCategoricalLayerView = function(scope) {
            map = scope.dataManager.getMaps().at(0);

            map.set("layers", scope.getLayers(map.id));
            //console.log(map);
            const layer = map.get('layers').at(2);
            console.log('LAYER', layer);
            scope.view = new LayerListChildView({
                app: scope.app,
                model: layer,
                collection: layer.get('symbols'),
                dataCollection: scope.dataManager.getCollection(layer.get('dataset').overlay_type)
            });
        };

        describe("LayerListChildView initialization: ", function () {
            beforeEach(function () {
                initSpies(this);
                initContinuousLayerView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(map.get('layers').at(1));
                expect(this.view.collection.length).toEqual(5);
            });
        });

        describe("LayerListChildView: ", function () {
            beforeEach(function () {
                initSpies(this);
                initContinuousLayerView(this);
            });

            it("should show layer menu when clicked", function () {
                this.view.render();
                expect(this.view.$el.find('.layer-menu').css('display')).toEqual('none');
                this.view.$el.find('.open-layer-menu').trigger('click');
                expect(this.view.$el.find('.layer-menu').css('display')).toEqual('block');

            });

            it("clicking '.rename-layer' should open 'layer edit' modal", function () {
                this.view.render();
                expect(Modal.prototype.update).toHaveBeenCalledTimes(0);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(0);
                expect(EditLayerName.prototype.initialize).toHaveBeenCalledTimes(0);
                this.view.$el.find('.open-layer-menu').trigger('click');
                this.view.$el.find('.rename-layer').trigger('click');
                expect(Modal.prototype.update).toHaveBeenCalledTimes(1);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(1);
                expect(EditLayerName.prototype.initialize).toHaveBeenCalledTimes(1);
            });
            it("EditLayerName modal renames modal", function () {
                this.view.render();

                this.view.$el.find('.open-layer-menu').trigger('click');
                this.view.$el.find('.rename-layer').trigger('click');

                expect(this.view.modal.$el.find('#layer-title').val()).toEqual('Trees Layer');


                this.view.modal.$el.find('#layer-title').val('Edited Trees Layer');
                this.view.modal.$el.find('.save-modal-form').trigger('click');

                // Check that both the model and the dom were updated
                expect(this.view.model.get('title')).toEqual('Edited Trees Layer');
                expect(this.view.$el.find('.layer-name').text()).toEqual('Edited Trees Layer');
            });

            it("clicking '.rename-layer' should open 'edit display field' modal", function () {
                this.view.render();
                expect(Modal.prototype.update).toHaveBeenCalledTimes(0);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(0);
                expect(EditDisplayField.prototype.initialize).toHaveBeenCalledTimes(0);
                this.view.$el.find('.open-layer-menu').trigger('click');
                this.view.$el.find('.edit-display-field').trigger('click');
                expect(Modal.prototype.update).toHaveBeenCalledTimes(1);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(1);
                expect(EditDisplayField.prototype.initialize).toHaveBeenCalledTimes(1);
            });
            it("EditDisplayField modal updates layer's 'display_field'", function() {
                this.view.render();

                this.view.$el.find('.open-layer-menu').trigger('click');
                this.view.$el.find('.edit-display-field').trigger('click');

                expect(this.view.model.get('display_field')).toEqual('height');
                expect(this.view.modal.$el.find('#display-field').val()).toEqual('height');
                this.view.modal.$el.find('#display-field').val('type');
                expect(this.view.modal.$el.find('#display-field').val()).toEqual('type');

                this.view.modal.$el.find('.save-modal-form').trigger('click');
                expect(this.view.model.get('display_field')).toEqual('type');
            });
            it(".collapse button hides and shows the Symbol Items", function() {
                this.view.render();
                expect(this.view.$el.find('.collapse')).toHaveClass('fa-caret-down');

                this.view.$el.find('.collapse').trigger('click');

                expect(this.view.$el.find('.collapse')).toHaveClass('fa-caret-up');
                expect(this.view.$el.find('.symbol').css('height')).toEqual('0px');
                expect(this.view.$el.find('.symbol-item').css('display')).toEqual('none');

                this.view.$el.find('.collapse').trigger('click');

                expect(this.view.$el.find('.collapse')).toHaveClass('fa-caret-down');
                expect(this.view.$el.find('.symbol-item').css('display')).toEqual('block');
            });
            it("Layer checkbox hides and shows Layer content and icons", function() {
                this.view.render();
                expect(SymbolCollectionView.prototype.redrawOverlays).toHaveBeenCalledTimes(5);
                this.view.$el.find('.layer-isShowing').prop('checked', false).trigger('change');
                console.log(this.view.$el[0])
                expect(this.view.$el[0]).toHaveClass('hide-layer');
                expect(SymbolCollectionView.prototype.hideOverlays).toHaveBeenCalledTimes(5);

                this.view.$el.find('.layer-isShowing').prop('checked', true).trigger('change');
                expect(this.view.$el[0]).not.toHaveClass('hide-layer');
                expect(SymbolCollectionView.prototype.redrawOverlays).toHaveBeenCalledTimes(10);
            });
            it("clicking 'add-record' icon opens menu", function() {
                this.view.render();
                expect(this.view.$el.find('.geometry-options').css('display')).toEqual('none');
                this.view.$el.find('.add-record-container').trigger('click');
                expect(this.view.$el.find('.geometry-options').css('display')).toEqual('block');
                expect(this.view.$el.find('.geometry-options').css('top')).toEqual('-15px');
                expect(this.view.$el.find('.geometry-options').css('left')).toEqual('-200px');

            });
            it("initAddPoint() works", function() {
                this.view.render();
                expect(LayerListChildView.prototype.initAddPoint).toHaveBeenCalledTimes(0);
                expect(LayerListChildView.prototype.notifyDrawingManager).toHaveBeenCalledTimes(0);
                //this.view.$el.find('.add-record-container').trigger('click');
                this.view.$el.find('#select-point').trigger('click');
                expect(LayerListChildView.prototype.initAddPoint).toHaveBeenCalledTimes(1);
                expect(LayerListChildView.prototype.notifyDrawingManager).toHaveBeenCalledTimes(1);
                expect(LayerListChildView.prototype.notifyDrawingManager).toHaveBeenCalledWith(
                    jasmine.any(Object), 'add-point');
            });
            it("initAddPolygon() works", function() {
                this.view.render();
                expect(LayerListChildView.prototype.initAddPolygon).toHaveBeenCalledTimes(0);
                expect(LayerListChildView.prototype.notifyDrawingManager).toHaveBeenCalledTimes(0);
                //this.view.$el.find('.add-record-container').trigger('click');
                this.view.$el.find('#select-polygon').trigger('click');
                expect(LayerListChildView.prototype.initAddPolygon).toHaveBeenCalledTimes(1);
                expect(LayerListChildView.prototype.notifyDrawingManager).toHaveBeenCalledTimes(1);
                expect(LayerListChildView.prototype.notifyDrawingManager).toHaveBeenCalledWith(
                    jasmine.any(Object), 'add-polygon');
            });
            it("initAddPolyline() works", function() {
                this.view.render();
                expect(LayerListChildView.prototype.initAddPolyline).toHaveBeenCalledTimes(0);
                expect(LayerListChildView.prototype.notifyDrawingManager).toHaveBeenCalledTimes(0);
                //this.view.$el.find('.add-record-container').trigger('click');
                this.view.$el.find('#select-polyline').trigger('click');
                expect(LayerListChildView.prototype.initAddPolyline).toHaveBeenCalledTimes(1);
                expect(LayerListChildView.prototype.notifyDrawingManager).toHaveBeenCalledTimes(1);
                expect(LayerListChildView.prototype.notifyDrawingManager).toHaveBeenCalledWith(
                    jasmine.any(Object), 'add-polyline');
            });
            it("notifyDrawingManager() works", function() {
                this.view.render();
                const mockEvent = {
                    preventDefault: function() {
                        return;
                    }
                }

                // mock the meny being open...
                this.view.$el.find('.add-record-container').trigger('click');
                this.view.notifyDrawingManager(mockEvent, 'add-point');

                expect(this.app.vent.trigger).toHaveBeenCalledWith('add-point', this.view.cid, mockEvent);
                expect(this.app.vent.trigger).toHaveBeenCalledWith('hide-detail');

                // in jasmine, 'toggle()' isn't setting 'display: block' back to 'display: none'
                // However, it works in the actual application...
                // expect(this.view.$el.find('.geometry-options').css('display')).toEqual('none');
            });
            it("LayerListChildView recieves notification when a new geometry is completed by the DrawingManager", function () {
                //spyOn(this.app.vent, 'trigger').and.callThrough();
                expect(LayerListChildView.prototype.addRecord).toHaveBeenCalledTimes(0);
                const mockGeometry = {geoJSON: 'mock arg', viewID: 456}
                this.view.app.vent.trigger('geometry-created', mockGeometry);
                expect(LayerListChildView.prototype.addRecord).toHaveBeenCalledTimes(1);
            });

            it("reAssignRecordToSymbols() assigns continuous symbols to 'uncategorized' if no category matches", function() {

                const highestSymbol = this.view.collection.models[this.view.collection.models.length-2];
                const uncategorizedSymbol = this.view.collection.models[this.view.collection.models.length-1];
                const record = this.view.dataCollection.get({'id': 18});

                expect(uncategorizedSymbol.matchedModels.length).toEqual(2);
                expect(highestSymbol.matchedModels.contains(record)).toEqual(true);
                expect(uncategorizedSymbol.matchedModels.contains(record)).toEqual(false);

                record.set('height', 100);
                record.trigger('update-symbol-assignment', record);

                expect(uncategorizedSymbol.matchedModels.length).toEqual(3);
                expect(highestSymbol.matchedModels.contains(record)).toEqual(false);
                expect(uncategorizedSymbol.matchedModels.contains(record)).toEqual(true);


            });
        });
        describe("LayerListChildView, categorical: ", function () {
            beforeEach(function () {
                initSpies(this);
                initCategoricalLayerView(this);
            });
            it("reassignRecordToSymbols() creates a new symbol when needed", function() {
                /*
                In this test, there is neither a symbol nor a record where 'type' equals 'magnolia'.
                We select a record and update its type to 'magnolia' and then test that a corresponding symbol has been created.
                This test implicitly tests the createNewSymbol() function.
                */
                let record = this.view.dataCollection.get({'id': 10});
                const pineSymbol = this.view.collection.where({'rule': "type = 'pine'"})[0];

                expect(this.view.collection.where({'rule': "type = 'magnolia'"}).length).toEqual(0);
                expect(this.view.collection.length).toEqual(6);
                expect(record.get('type')).toEqual('Pine');
                expect(LayerListChildView.prototype.reAssignRecordToSymbols).toHaveBeenCalledTimes(0);
                expect(pineSymbol.matchedModels.length).toEqual(2);

                record.set('type', 'magnolia');
                record.trigger('update-symbol-assignment', record);

                const magnoliaSymbol = this.view.collection.where({'rule': "type = 'magnolia'"})[0];

                expect(LayerListChildView.prototype.reAssignRecordToSymbols).toHaveBeenCalledTimes(1);
                expect(this.view.collection.length).toEqual(7);
                expect(this.view.collection.where({'rule': "type = 'magnolia'"}).length).toEqual(1);
                expect(pineSymbol.matchedModels.length).toEqual(1);
                expect(magnoliaSymbol.matchedModels.length).toEqual(1);
            });
            it("reassignRecordToSymbols() deletes an unneeded symbol when a record is updated and no longer matches", function() {
                /*
                In this test, there is a symbol for records where 'type' equals 'hickory, and a single matching record.
                We update the matching record from 'hickory' to 'oak' and check to make sure that the record is
                is now matched to the 'oak' symbol. We also check that the 'hickory' symbol has been deleted
                (since it no longer has any matching records).
                This test implicitly tests the removeEmptySymbols() function.
                */

                let record = this.view.dataCollection.get({'id': 50});
                const hickorySymbol = this.view.collection.where({'rule': "type = 'hickory'"})[0];
                const oakSymbol = this.view.collection.where({'rule': "type = 'oak'"})[0];
                expect(this.view.collection.where({'rule': "type = 'hickory'"}).length).toEqual(1);

                expect(this.view.collection.length).toEqual(6);
                expect(record.get('type')).toEqual('Hickory');
                expect(LayerListChildView.prototype.reAssignRecordToSymbols).toHaveBeenCalledTimes(0);
                expect(hickorySymbol.matchedModels.length).toEqual(1);
                expect(oakSymbol.matchedModels.length).toEqual(7);

                record.set('type', 'oak');
                record.trigger('update-symbol-assignment', record);

                expect(LayerListChildView.prototype.reAssignRecordToSymbols).toHaveBeenCalledTimes(1);
                expect(this.view.collection.length).toEqual(5);
                expect(this.view.collection.where({'rule': "type = 'hickory'"}).length).toEqual(0);
                expect(hickorySymbol.matchedModels.length).toEqual(0);
                expect(oakSymbol.matchedModels.length).toEqual(8);
            });
            it("removeEmptySymbols() gets called upon initialization of LayerListChildView", function() {
                expect(LayerListChildView.prototype.removeEmptySymbols).toHaveBeenCalledTimes(1);

            });

            it("reAssignRecordsToSymbols() gets called upon initialization of LayerListChildView", function() {
                expect(LayerListChildView.prototype.reAssignRecordsToSymbols).toHaveBeenCalledTimes(1);
            });

            it("isEmpty() convenience function works", function() {
                expect(this.view.isEmpty('')).toEqual(true);
                expect(this.view.isEmpty("")).toEqual(true);
                expect(this.view.isEmpty(undefined)).toEqual(true);
                expect(this.view.isEmpty(null)).toEqual(true);
                expect(this.view.isEmpty(0)).toEqual(false);
                expect(this.view.isEmpty('text')).toEqual(false);
            });

            it("createNewSymbol() works", function() {

                expect(this.view.collection.where({'rule': "type = 'mahogany'"}).length).toEqual(0);

                const initialSymbolCount = this.view.collection.models.length;
                let record = this.view.dataCollection.get({'id': 50});
                record.set('type', 'mahogany');
                this.view.createNewSymbol(this.view.collection, record);

                // the newest symbol always gets inserted at the end of the list, but before the final (uncategorized) symbol. Therefore, length - 2.
                const newSymbol = this.view.collection.models[this.view.collection.models.length-2];

                expect(newSymbol.get('rule')).toEqual("type = 'mahogany'");
                expect(this.view.collection.models.length).toEqual(initialSymbolCount + 1);
            });
        });
    });
