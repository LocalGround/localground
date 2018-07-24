var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/spreadsheet/layout",
    rootDir + "apps/main/views/spreadsheet/spreadsheet",
    "tests/spec-helper1"
],
    function (Backbone, SpreadsheetLayoutView, Spreadsheet) {
        'use strict';

        const initView = function (scope) {
            //fixture = setFixtures('<div style="width:800px;height:600px"></div>');
            spyOn(SpreadsheetLayoutView.prototype, 'initialize').and.callThrough();
            spyOn(SpreadsheetLayoutView.prototype, 'addRow').and.callThrough();
            spyOn(SpreadsheetLayoutView.prototype, 'showSpreadsheet').and.callThrough();
            spyOn(Spreadsheet.prototype, 'initialize').and.callThrough();
            spyOn(Spreadsheet.prototype, 'addRow');

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

            it("should listen for DOM clicks", function () {
                this.view.render();
                expect(this.view.addRow).toHaveBeenCalledTimes(0);
                this.view.$el.find('#add-row').trigger('click');
                expect(this.view.addRow).toHaveBeenCalledTimes(1);
            });
        });

        describe("SpreadsheetLayout: instance methods work: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("add row should call the spreadsheet's addRow method", function () {
                expect(Spreadsheet.prototype.addRow).toHaveBeenCalledTimes(0);
                this.view.addRow();
                expect(Spreadsheet.prototype.addRow).toHaveBeenCalledTimes(1);
            });
        });

    });
