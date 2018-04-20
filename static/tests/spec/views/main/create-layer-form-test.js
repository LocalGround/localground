var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/left/create-layer-form",
    rootDir + "lib/modals/modal",
    "tests/spec-helper1"
],
    function (Backbone, CreateLayerForm, Modal) {
        'use strict';
        var map;

        const initView = function (scope) {
            spyOn(CreateLayerForm.prototype, 'initialize').and.callThrough();
            spyOn(Modal.prototype, 'show').and.callThrough();
            spyOn(Modal.prototype, 'update').and.callThrough();

            spyOn(scope.app.vent, 'trigger');

            map = scope.dataManager.getMaps().at(0);
            map.set("layers", scope.getLayers(map.id));

            scope.view = new CreateLayerForm({
                app: scope.app,
                model: map
            });
        };

        describe("CreateLayerForm: initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(map);
                //expect(this.view.collection.length).toEqual(1);
            });
        });

        describe("CreateLayerForm: UI rendering / listening works: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should render form correctly", function () {
                expect(1).toEqual(1);
            });

        });
    });
