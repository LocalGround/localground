var rootDir = "../../../";
define([
    "backbone",
    rootDir + "lib/spreadsheet/views/rename-dataset",
    "tests/spec-helper1"
],
    function (Backbone, RenameDataset) {
        'use strict';

        const initView = function (scope) {
            spyOn(RenameDataset.prototype, 'initialize').and.callThrough();
            spyOn(RenameDataset.prototype, 'saveDataset').and.callThrough();

            scope.layer = scope.categoricalLayer;
            scope.view = new RenameDataset({
                app: scope.app,
                model: scope.dataset_3.getForm()
            });

            spyOn(scope.app.vent, 'trigger');
            spyOn(scope.view.model, 'fetch').and.callThrough();
            spyOn(scope.view.model, 'save').and.callThrough();

        };

        describe("RenameDataset: initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(this.dataset_3.getForm());
            });
        });

        describe('RenameDataset: instance methods: ', function () {
            beforeEach(function () {
                initView(this);
            });

            it("works", function () {
                expect(1).toEqual(1);
            });
        });

        describe('RenameDataset: rendering: ', function () {

            beforeEach(function () {
                initView(this);
                this.view.render();
            });


            it("works", function () {
                expect(1).toEqual(1);
            });

        });

    });
