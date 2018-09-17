var rootDir = "../../../";
define([
    "backbone",
    rootDir + "lib/spreadsheet/views/layout",
    rootDir + "lib/spreadsheet/views/spreadsheet",
    "tests/spec-helper1"
],
    function (Backbone, SpreadsheetLayoutView, Spreadsheet) {
        'use strict';

        const initView = function (scope) {
            //fixture = setFixtures('<div style="width:800px;height:600px"></div>');
            spyOn(SpreadsheetLayoutView.prototype, 'initialize').and.callThrough();
            spyOn(SpreadsheetLayoutView.prototype, 'showSpreadsheet').and.callThrough();
            spyOn(Spreadsheet.prototype, 'initialize').and.callThrough();

            scope.view = new SpreadsheetLayoutView({
                app: scope.app,
                collection: scope.dataset_2,
                layer: scope.categoricalLayer
            });
        };

        describe("SpreadsheetLayout: initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.layer).toEqual(this.categoricalLayer);
            });

            it("should render spreadsheet on on render", function () {
                expect(this.view.showSpreadsheet).toHaveBeenCalledTimes(0);
                expect(Spreadsheet.prototype.initialize).toHaveBeenCalledTimes(0);
                this.view.render();
                expect(this.view.showSpreadsheet).toHaveBeenCalledTimes(1);
                expect(Spreadsheet.prototype.initialize).toHaveBeenCalledTimes(1);
            });
        });

        describe("SpreadsheetLayout: instance methods work: ", function () {
            beforeEach(function () {
                initView(this);
            });
        });

    });
