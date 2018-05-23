var rootDir = "../../../";
define([
    "backbone",
    rootDir + "lib/modals/modal",
    rootDir + "lib/popovers/popover",
    rootDir + "apps/main/views/left/edit-layer-menu",
    rootDir + "apps/main/views/left/layer-list-child-view1",
    rootDir + "apps/main/views/left/edit-layer-name-modal-view",
    rootDir + "apps/main/views/left/edit-display-field-modal-view",
    rootDir + "lib/maps/overlays/marker",
    rootDir + "lib/maps/overlays/infobubbles/base",
    "tests/spec-helper1"
],
    function (Backbone, Modal, Popover, EditLayerMenu, LayerListChildView,
            EditLayerName, EditDisplayField, Overlay, InfoBubble) {
        'use strict';

        let map, layer;
        const initView = function (scope) {
            spyOn(EditLayerMenu.prototype, 'initialize').and.callThrough();
            spyOn(EditLayerMenu.prototype, 'editLayerName').and.callThrough();
            spyOn(EditLayerMenu.prototype, 'deleteLayer').and.callThrough();

            spyOn(EditLayerMenu.prototype, 'editDisplayField').and.callThrough();
            spyOn(EditLayerMenu.prototype, 'getMarkerOverlays').and.callThrough();
            spyOn(EditLayerMenu.prototype, 'getBounds').and.callThrough();
            spyOn(EditLayerMenu.prototype, 'zoomToExtents').and.callThrough();


            spyOn(Modal.prototype, 'show').and.callThrough();
            spyOn(Modal.prototype, 'update').and.callThrough();
            spyOn(Popover.prototype, 'update').and.callThrough();

            spyOn(EditLayerName.prototype, 'initialize').and.callThrough();
            spyOn(EditDisplayField.prototype, 'initialize').and.callThrough();

            // prevent these from being called
            spyOn(InfoBubble.prototype, "initialize");
            spyOn(InfoBubble.prototype, "remove");
            spyOn(Overlay.prototype, "initialize");
            spyOn(Overlay.prototype, "redraw");
            spyOn(Overlay.prototype, "onBeforeDestroy");
            spyOn(Overlay.prototype, "getBounds");
            spyOn(Overlay.prototype, "show");
            spyOn(Overlay.prototype, "hide");

            spyOn(scope.app.vent, 'trigger').and.callThrough();
            map = scope.dataManager.getMaps().at(0);
            map.set("layers", scope.getLayers(map.id));
            layer = map.get('layers').at(1);

            spyOn(layer, 'destroy').and.callThrough();

            scope.parent = new LayerListChildView({
                app: scope.app,
                model: layer,
                collection: layer.get('symbols'),
                dataCollection: scope.dataManager.getCollection(layer.get('dataset').overlay_type)
            });
            scope.parent.render();
            scope.view = new EditLayerMenu({
                app: scope.app,
                model: layer,
                children: scope.parent.children
            });
        };

        describe("EditLayerMenu initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(map.get('layers').at(1));
                expect(this.view.children.length).toEqual(5);
            });
        });

        describe("EditLayerMenu: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("clicking '.rename-layer' should open 'layer edit' modal", function () {
                this.view.render();
                expect(Modal.prototype.update).toHaveBeenCalledTimes(0);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(0);
                expect(EditLayerName.prototype.initialize).toHaveBeenCalledTimes(0);

                this.view.$el.find('.rename-layer').trigger('click');
                expect(Modal.prototype.update).toHaveBeenCalledTimes(1);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(1);
                expect(EditLayerName.prototype.initialize).toHaveBeenCalledTimes(1);
            });

            it("EditLayerName modal renames modal", function () {
                this.view.render();
                this.view.$el.find('.rename-layer').trigger('click');
                expect(this.view.modal.$el.find('#layer-title').val()).toEqual('Trees Layer');


                this.view.modal.$el.find('#layer-title').val('Edited Trees Layer');
                this.view.modal.$el.find('.save-modal-form').trigger('click');

                // Check that both the model and the dom were updated
                expect(this.view.model.get('title')).toEqual('Edited Trees Layer');
            });

            it("clicking '.rename-layer' should open 'edit display field' modal", function () {
                this.view.render();
                expect(Modal.prototype.update).toHaveBeenCalledTimes(0);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(0);
                expect(EditDisplayField.prototype.initialize).toHaveBeenCalledTimes(0);

                this.view.$el.find('.edit-display-field').trigger('click');
                expect(Modal.prototype.update).toHaveBeenCalledTimes(1);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(1);
                expect(EditDisplayField.prototype.initialize).toHaveBeenCalledTimes(1);
            });

            it("EditDisplayField modal updates layer's 'display_field'", function() {
                this.view.render();

                this.view.$el.find('.edit-display-field').trigger('click');

                expect(this.view.model.get('display_field')).toEqual('height');
                expect(this.view.modal.$el.find('#display-field').val()).toEqual('height');
                this.view.modal.$el.find('#display-field').val('type');
                expect(this.view.modal.$el.find('#display-field').val()).toEqual('type');

                this.view.modal.$el.find('.save-modal-form').trigger('click');
                expect(this.view.model.get('display_field')).toEqual('type');
            });

            it("Zoom To Extents zooms to extents", function() {
                this.view.render();
                expect(EditLayerMenu.prototype.getMarkerOverlays).toHaveBeenCalledTimes(0);
                expect(EditLayerMenu.prototype.getBounds).toHaveBeenCalledTimes(0);
                expect(EditLayerMenu.prototype.zoomToExtents).toHaveBeenCalledTimes(0);
                this.view.$el.find('.zoom-to-extents').trigger('click');
                expect(EditLayerMenu.prototype.getMarkerOverlays).toHaveBeenCalledTimes(1);
                expect(EditLayerMenu.prototype.getBounds).toHaveBeenCalledTimes(1);
                expect(EditLayerMenu.prototype.zoomToExtents).toHaveBeenCalledTimes(1);
            });

            it("Delete Layer click calls deleteLayer", function() {
                this.view.render();
                spyOn(window, 'confirm').and.returnValue(true);
                expect(EditLayerMenu.prototype.deleteLayer).toHaveBeenCalledTimes(0);
                expect(layer.destroy).toHaveBeenCalledTimes(0);
                this.view.$el.find('.delete-layer').trigger('click');
                expect(EditLayerMenu.prototype.deleteLayer).toHaveBeenCalledTimes(1);
                expect(layer.destroy).toHaveBeenCalledTimes(1);
                expect(this.app.vent.trigger).toHaveBeenCalledWith('hide-popover');
            });

            it("Delete Layer click with cancellation does not destroy model", function() {
                this.view.render();
                spyOn(window, 'confirm').and.returnValue(false);
                expect(EditLayerMenu.prototype.deleteLayer).toHaveBeenCalledTimes(0);
                expect(layer.destroy).toHaveBeenCalledTimes(0);
                this.view.$el.find('.delete-layer').trigger('click');
                expect(EditLayerMenu.prototype.deleteLayer).toHaveBeenCalledTimes(1);
                expect(layer.destroy).toHaveBeenCalledTimes(0);
            });

        });
    });
