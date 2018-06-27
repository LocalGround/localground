var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/left/layer-list-view",
    rootDir + "lib/maps/overlays/marker",
    "tests/spec-helper1"
],
    function (Backbone, LayerListView, MarkerOverlay) {
        'use strict';
        var map;

        const initView = function (scope) {
            spyOn(LayerListView.prototype, 'initialize').and.callThrough();
            spyOn(MarkerOverlay.prototype, "initialize");
            spyOn(MarkerOverlay.prototype, "redraw");


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
                expect(this.view.collection.length).toEqual(4);
            });
        });

    });
