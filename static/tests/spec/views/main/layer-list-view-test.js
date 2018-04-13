var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/left/layer-list-view",
    rootDir + "apps/main/views/left/new-layer-modal-view",
    rootDir + "lib/maps/overlays/marker",
    rootDir + "lib/modals/modal",
    "tests/spec-helper1"
],
    function (Backbone, LayerListView, CreateLayerForm, MarkerOverlay, Modal) {
        'use strict';
        var map;

        const initView = function (scope) {
            spyOn(LayerListView.prototype, 'initialize').and.callThrough();
            spyOn(LayerListView.prototype, 'createNewLayer').and.callThrough();
            spyOn(CreateLayerForm.prototype, 'initialize').and.callThrough();
            spyOn(Modal.prototype, 'show').and.callThrough();
            spyOn(Modal.prototype, 'update').and.callThrough();
            spyOn(MarkerOverlay.prototype, "initialize");
            spyOn(MarkerOverlay.prototype, "redraw");

            spyOn(scope.app.vent, 'trigger');
            spyOn(scope.app.router, 'navigate');

            map = scope.dataManager.getMaps().at(0);
            map.set("layers", scope.getLayers(map.id));
            scope.view = new LayerListView({
                app: scope.app,
                model: map,
                collection: map.getLayers()
            })

        };

        describe("LayerListView: initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(map);
                expect(this.view.collection.length).toEqual(1);
            });
        });

        describe("LayerListView: UI rendering / listening works: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should render add layer button", function () {
                this.view.render();
                expect(this.view.$el).toContainElement('.add-layer');
                expect(this.view.$el).toContainElement('i.fa-plus');
                expect(this.view.$el).toContainText('Add Layer');
            });

            it("should listen for add layer button click", function () {
                expect(this.view.createNewLayer).toHaveBeenCalledTimes(0);
                this.view.render();
                this.view.$el.find('.add-layer').trigger('click');
                expect(this.view.createNewLayer).toHaveBeenCalledTimes(1);
            });
        });

        describe("LayerListView: Add layer works", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should open 'add layer' modal", function () {
                expect(Modal.prototype.update).toHaveBeenCalledTimes(0);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(0);
                expect(CreateLayerForm.prototype.initialize).toHaveBeenCalledTimes(0);
                this.view.createNewLayer();
                expect(Modal.prototype.update).toHaveBeenCalledTimes(1);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(1);
                expect(CreateLayerForm.prototype.initialize).toHaveBeenCalledTimes(1);
            });
        });
    });
