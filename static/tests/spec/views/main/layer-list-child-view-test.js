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
    rootDir + "models/record",
    "tests/spec-helper1"
],
    function (Backbone, LayerListChildView, EditLayerName, EditDisplayField, SymbolCollectionView, SymbolItemView, MarkerOverlay, Modal, Record) {
        'use strict';
        var map, layer;

        const initView = function (scope) {
            spyOn(LayerListChildView.prototype, 'initialize').and.callThrough();
            spyOn(LayerListChildView.prototype, 'showHideOverlays').and.callThrough();
            spyOn(LayerListChildView.prototype, 'initAddPoint').and.callThrough();
            spyOn(LayerListChildView.prototype, 'initAddPolygon').and.callThrough();
            spyOn(LayerListChildView.prototype, 'initAddPolyline').and.callThrough();
            spyOn(LayerListChildView.prototype, 'notifyDrawingManager').and.callThrough();
            spyOn(LayerListChildView.prototype, 'addRecord').and.callThrough();

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
            spyOn(Record.prototype, 'save');

            spyOn(scope.app.vent, 'trigger').and.callThrough();
            spyOn(scope.app.router, 'navigate');

            map = scope.dataManager.getMaps().at(0);

            map.set("layers", scope.getLayers(map.id));
            console.log(map);
            layer = map.get('layers').at(1);
            scope.view = new LayerListChildView({
                app: scope.app,
                model: layer,
                collection: layer.get('symbols'),
                dataCollection: scope.dataManager.getCollection(layer.get('dataset').overlay_type)
            });
        };

        describe("LayerListChildView initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(map.get('layers').at(1));
                expect(this.view.collection.length).toEqual(5);
            });
        });

        describe("LayerListChildView: ", function () {
            beforeEach(function () {
                initView(this);
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

                // mock the menu being open...
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
        });
    });
