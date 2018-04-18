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
        var map, layer;

        const initView = function (scope) {
            spyOn(LayerListChildView.prototype, 'initialize').and.callThrough();
            // prevents functions related to overlays from being called
            spyOn(LayerListChildView.prototype, 'showHideOverlays').and.callThrough();;  

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

            spyOn(scope.app.vent, 'trigger');
            spyOn(scope.app.router, 'navigate');

            map = scope.dataManager.getMaps().at(0);
            
            map.set("layers", scope.getLayers(map.id));
            console.log(map);
            layer = map.get('layers').at(1);
            scope.view = new LayerListChildView({
                app: scope.app,
                model: layer,
                collection: layer.get('symbols'),
                dataCollection: scope.dataManager.getCollection(layer.get('data_source'))
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
                expect(this.view.$el.find('.collapse')).toHaveClass('fa-angle-down');

                this.view.$el.find('.collapse').trigger('click');

                expect(this.view.$el.find('.collapse')).toHaveClass('fa-angle-up');
                expect(this.view.$el.find('.symbol').css('height')).toEqual('0px');
                expect(this.view.$el.find('.symbol-item').css('display')).toEqual('none');

                this.view.$el.find('.collapse').trigger('click');

                expect(this.view.$el.find('.collapse')).toHaveClass('fa-angle-down');                
                expect(this.view.$el.find('.symbol-item').css('display')).toEqual('block');
            });
            it("Layer checkbox hides and shows Layer content and icons", function() {
                this.view.render();
                expect(SymbolCollectionView.prototype.redrawOverlays).toHaveBeenCalledTimes(5);
                this.view.$el.find('.layer-isShowing').prop('checked', false).trigger('change');
                expect(this.view.$el.find('#symbols-list').css('display')).toEqual('none');
                expect(SymbolCollectionView.prototype.hideOverlays).toHaveBeenCalledTimes(5);

                this.view.$el.find('.layer-isShowing').prop('checked', true).trigger('change');
                expect(this.view.$el.find('#symbols-list').css('display')).toEqual('block');
                expect(SymbolCollectionView.prototype.redrawOverlays).toHaveBeenCalledTimes(10);
            });

        });
    });
