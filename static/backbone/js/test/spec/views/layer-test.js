define([
    "models/layer",
    "views/maps/sidepanel/items/layerItem",
    "views/maps/overlays/layer",
    "lib/maps/data/dataManager",
    "../../../test/spec-helper"
],
    function (Layer, LayerItem, LayerView, DataManager) {
        'use strict';
        var getDataManager = function (scope) {
            return new DataManager({
                app: scope.app,
                projects: scope.projectsLite
            });
        };
        describe("Layer Model: Tests model attribute validation", function () {
            it("Can initialize with empty Projects collection", function () {
                var that = this,
                    layerView = null;
                expect(function () {
                    var layerItem = new LayerItem({
                        model: new Layer({ id: 1, symbols: [] }),
                        app: that.app
                    });
                    layerView = new LayerView({
                        dataManager: getDataManager(that),
                        layerItem: layerItem,
                        basemap: { map: { fitBounds: 'a' }},
                        app: that.app
                    });
                }).not.toThrow();
            });
        });
    });
