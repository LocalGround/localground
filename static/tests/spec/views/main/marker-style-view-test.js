var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/right/marker-style-view",
    "tests/spec-helper1"
],
    function (Backbone, MarkerStyleView) {
        'use strict';
        var map, layer, symbol;

        const initView = function (scope) {
            spyOn(MarkerStyleView.prototype, 'initialize').and.callThrough();
            spyOn(MarkerStyleView.prototype, 'render').and.callThrough();
            spyOn(MarkerStyleView.prototype, 'setSymbols').and.callThrough();
            spyOn(MarkerStyleView.prototype, 'saveChanges').and.callThrough();
            spyOn(MarkerStyleView.prototype, 'updateGlobalShape').and.callThrough();

            map = scope.dataManager.getMaps().at(0);
            layer = scope.getLayers(map.id).at(1);
            scope.view = new MarkerStyleView({
                app: scope.app,
                model: layer
            });
        };

        describe("MarkerStyleView: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(layer);
            });

            it("behavior: changing group_by", function () {
                this.view.render();
                expect(this.view.model.get('symbols').length).toEqual(5);
                expect(this.view.model.get('metadata').buckets).toEqual(4);
                expect(this.view.model.get('group_by')).toEqual('height');
                expect(this.view.setSymbols).toHaveBeenCalledTimes(0);
                expect(this.view.saveChanges).toHaveBeenCalledTimes(0);

                this.view.$el.find('#data-type-select').val("individual").change();

                const records = this.dataManager.getCollection(
                    this.layer.get('dataset').overlay_type
                )
                expect(this.view.model.get('symbols').length).toEqual(18);
                expect(this.view.model.get('symbols').length).toEqual(records.length);
                expect(this.view.model.get('group_by')).toEqual('individual');
                expect(this.view.setSymbols).toHaveBeenCalledTimes(1);
                expect(this.view.saveChanges).toHaveBeenCalledTimes(1);
            });

            it("behavior: changing shape", function () {
                this.view.render();
                expect(this.view.model.get('symbols').shape).toEqual('circle');
                expect(this.view.updateGlobalShape).toHaveBeenCalledTimes(0);

                this.view.$el.find('.style-menu_shape-wrapper[data-shape="square"]').click();

                expect(this.view.updateGlobalShape).toHaveBeenCalledTimes(1);
                expect(this.view.model.get('metadata').shape).toEqual('square');
            });
        });
    });
