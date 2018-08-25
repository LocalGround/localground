var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/spreadsheet/context-menu",
    rootDir + "apps/main/views/spreadsheet/spreadsheet",
    "tests/spec-helper1"
],
    function (Backbone, ContextMenu, Spreadsheet) {
        'use strict';

        const initView = function (scope) {
            spyOn(ContextMenu.prototype, 'initialize').and.callThrough();
            spyOn(ContextMenu.prototype, 'sortAsc').and.callThrough();
            spyOn(ContextMenu.prototype, 'sortDesc').and.callThrough();
            spyOn(ContextMenu.prototype, 'sort').and.callThrough();
            spyOn(ContextMenu.prototype, 'addFieldBefore').and.callThrough();
            spyOn(ContextMenu.prototype, 'addFieldAfter').and.callThrough();
            spyOn(ContextMenu.prototype, 'editField').and.callThrough();
            spyOn(ContextMenu.prototype, 'deleteField').and.callThrough();

            scope.view = new ContextMenu({
                app: scope.app,
                model: scope.dataset_2.getFields().at(0),
                collection: scope.dataset_2
            });
        };

        describe("SpreadsheetContextMenu: initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(this.dataset_2.getFields().at(0));
            });

            // it("should render spreadsheet on on render", function () {
            //     expect(this.view.showSpreadsheet).toHaveBeenCalledTimes(0);
            //     expect(Spreadsheet.prototype.initialize).toHaveBeenCalledTimes(0);
            //     this.view.render();
            //     expect(this.view.showSpreadsheet).toHaveBeenCalledTimes(1);
            //     expect(Spreadsheet.prototype.initialize).toHaveBeenCalledTimes(1);
            // });
        });

        describe("SpreadsheetContextMenu: instance methods work: ", function () {
            beforeEach(function () {
                initView(this);
            });
        });

    });
