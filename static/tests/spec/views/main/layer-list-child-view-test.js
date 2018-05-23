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
    rootDir + "lib/popovers/popover",
    rootDir + "apps/main/views/left/add-marker-menu",
    rootDir + "apps/main/views/left/edit-layer-menu",
    "tests/spec-helper1"
],
    function (Backbone, LayerListChildView, EditLayerName, EditDisplayField,
                SymbolCollectionView, SymbolItemView, MarkerOverlay, Modal, Record,
                Popover, AddMarkerMenu, EditLayerMenu) {
        'use strict';
        var map, layer;

        const initView = function (scope) {
            spyOn(LayerListChildView.prototype, 'initialize').and.callThrough();
            spyOn(LayerListChildView.prototype, 'showHideOverlays').and.callThrough();
            spyOn(LayerListChildView.prototype, 'addRecord').and.callThrough();
            spyOn(LayerListChildView.prototype, 'showLayerMenu').and.callThrough();
            spyOn(LayerListChildView.prototype, 'displayGeometryOptions').and.callThrough();

            spyOn(EditLayerMenu.prototype, 'initialize').and.callThrough();
            spyOn(EditLayerName.prototype, 'initialize').and.callThrough();
            spyOn(EditDisplayField.prototype, 'initialize').and.callThrough();
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
            spyOn(Record.prototype, 'save');

            spyOn(scope.app.vent, 'trigger').and.callThrough();

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
