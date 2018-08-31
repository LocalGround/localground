var rootDir = "../../";
define([
    "handlebars",
    rootDir + "../apps/main/views/spreadsheet/spreadsheet",
    rootDir + "../apps/main/views/spreadsheet/context-menu",
    rootDir + "../models/form",
    rootDir + "../collections/records",
    rootDir + "../lib/data/dataManager",
    rootDir + '../apps/main/views/spreadsheet/add-field',
    rootDir + '../apps/main/views/spreadsheet/edit-field',
    "tests/spec-helper1"
],
    function (Handlebars, Spreadsheet, ContextMenu, Form, Records, DataManager,
            AddField, EditField) {
        'use strict';
        var fixture;
        var newSpreadsheet;

        var setupSpreadsheetTest = function (scope) {
            fixture = setFixtures('<div id="ss" style="width:800px;height:600px"></div>');
            // add spies:
            spyOn(window, 'confirm').and.returnValue(true);

            spyOn(Spreadsheet.prototype, 'render').and.callThrough();
            spyOn(Spreadsheet.prototype, 'renderSpreadsheet').and.callThrough();
            spyOn(Spreadsheet.prototype, 'initialize').and.callThrough();
            spyOn(Spreadsheet.prototype, 'showContextMenu').and.callThrough();
            spyOn(Spreadsheet.prototype, 'addRow').and.callThrough();
            spyOn(Spreadsheet.prototype, 'addField').and.callThrough();
            spyOn(Spreadsheet.prototype, 'editField').and.callThrough();
            spyOn(Spreadsheet.prototype, 'deleteField').and.callThrough();
            spyOn(Spreadsheet.prototype, 'doSearch').and.callThrough();
            spyOn(Spreadsheet.prototype, 'clearSearch').and.callThrough();

            spyOn(ContextMenu.prototype, 'sortAsc').and.callThrough();
            spyOn(ContextMenu.prototype, 'sort').and.callThrough();

            spyOn(DataManager.prototype, 'addRecordToCollection').and.callThrough();
            spyOn(DataManager.prototype, 'reloadDatasetFromServer').and.callThrough();

            spyOn(AddField.prototype, 'initialize').and.callThrough();
            spyOn(EditField.prototype, 'initialize').and.callThrough();

            scope.collection = scope.dataset_3;
            scope.spreadsheet = new Spreadsheet({
                app: scope.app,
                collection: scope.collection,
                fields: scope.collection.getFields(),
                layer: scope.uniformLayer,
                height: $(window).height() - 180
            });
            scope.spreadsheet.render();
            fixture.find('#ss').append(scope.spreadsheet.$el);
            scope.spreadsheet.renderSpreadsheet();
        };

        describe("Spreadsheet: Initialization Tests", function () {
            beforeEach(function () {
                setupSpreadsheetTest(this);
            });

            it("Spreadsheet Successfully created", function () {
                expect(this.spreadsheet).toEqual(jasmine.any(Spreadsheet));
                expect(this.spreadsheet.collection.length).toBe(this.collection.length);
                expect(this.spreadsheet.collection).toEqual(jasmine.any(Records));
            });

            it("Renders all the rows", function () {
                expect(this.spreadsheet.$el.find('.htCore tbody tr').length).toEqual(this.collection.length);
                expect(this.collection.length).toEqual(5);
            });

            it("addRow Works", function () {
                this.spreadsheet.addRow()
                expect(this.spreadsheet.$el.find('.htCore tbody tr').length).toEqual(this.collection.length);
                expect(this.collection.length).toEqual(6);
            });

        });

        describe("Spreadsheet: listens for even handlers", function () {
            beforeEach(function () {
                setupSpreadsheetTest(this);
            });

            it("listens for app.vent() triggers", function () {
                //do search:
                expect(Spreadsheet.prototype.doSearch).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('search-requested', 'dog');
                expect(Spreadsheet.prototype.doSearch).toHaveBeenCalledTimes(1);

            });
            it("listens for app.vent('clear search') trigger", function () {
                expect(Spreadsheet.prototype.clearSearch).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('clear-search');
                expect(Spreadsheet.prototype.clearSearch).toHaveBeenCalledTimes(1);

            });
            it("listens for app.vent('render spreadsheet') trigger", function () {
                expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(1);
                this.app.vent.trigger("render-spreadsheet");
                expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(2);

            });
            it("listens for app.vent('field updated') trigger", function () {
                expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(1);
                this.app.vent.trigger("field-updated");
                expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(2);

            });
            it("listens for app.vent('add field') trigger", function () {
                expect(Spreadsheet.prototype.addField).toHaveBeenCalledTimes(0);
                this.app.vent.trigger("add-field", 1);
                expect(Spreadsheet.prototype.addField).toHaveBeenCalledTimes(1);

            });
            it("listens for app.vent('edit field') trigger", function () {
                expect(Spreadsheet.prototype.editField).toHaveBeenCalledTimes(0);
                this.app.vent.trigger("edit-field", 1);
                expect(Spreadsheet.prototype.editField).toHaveBeenCalledTimes(1);

            });
            it("listens for app.vent('delete field') trigger", function () {
                expect(Spreadsheet.prototype.deleteField).toHaveBeenCalledTimes(0);
                this.app.vent.trigger("delete-field", 1);
                expect(Spreadsheet.prototype.deleteField).toHaveBeenCalledTimes(1);
            });

            it("show ContextMenu click works", function () {
                //not sure why twice as many rows. Must be a HOT thing
                //this.spreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.showContextMenu).toHaveBeenCalledTimes(0);
                const $firstColContextButton = $(fixture.find('.column-opts')[0]);
                $firstColContextButton.trigger('click');
                expect(Spreadsheet.prototype.showContextMenu).toHaveBeenCalledTimes(1);
            });

            it("ContextMenu item click works", function () {
                //not sure why twice as many rows. Must be a HOT thing
                const $firstColContextButton = $(fixture.find('.column-opts')[0]);
                $firstColContextButton.trigger('click');
                expect(Spreadsheet.prototype.showContextMenu).toHaveBeenCalledTimes(1);
                expect(ContextMenu.prototype.sortAsc).toHaveBeenCalledTimes(0);
                expect(ContextMenu.prototype.sort).toHaveBeenCalledTimes(0);

                //just test the first one (other tests available in context-menu-test):
                $('body').find('.sort-asc').trigger('click');
                expect(ContextMenu.prototype.sortAsc).toHaveBeenCalledTimes(1);
                expect(ContextMenu.prototype.sort).toHaveBeenCalledWith('asc');
            });

        });

        describe("Spreadsheet: instance methods work", function () {
            beforeEach(function () {
                setupSpreadsheetTest(this);
            });

            it("addRow works", function () {
                expect(DataManager.prototype.addRecordToCollection).toHaveBeenCalledTimes(0);
                expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(1);
                expect(this.spreadsheet.collection.length).toEqual(5);
                this.spreadsheet.addRow();
                expect(DataManager.prototype.addRecordToCollection).toHaveBeenCalledTimes(1);
                expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(2);
                expect(this.spreadsheet.collection.length).toEqual(6);
            });

            it("addField works", function () {
                expect(AddField.prototype.initialize).toHaveBeenCalledTimes(0);
                this.spreadsheet.addField(1);
                expect(AddField.prototype.initialize).toHaveBeenCalledTimes(1);
            });

            it("editField works", function () {
                expect(EditField.prototype.initialize).toHaveBeenCalledTimes(0);
                this.spreadsheet.editField(1);
                expect(EditField.prototype.initialize).toHaveBeenCalledTimes(1);
            });

            it("deleteField works", function () {
                expect(DataManager.prototype.reloadDatasetFromServer).toHaveBeenCalledTimes(0);
                expect(this.spreadsheet.fields.length).toEqual(3);
                this.spreadsheet.deleteField(0);
                expect(DataManager.prototype.reloadDatasetFromServer).toHaveBeenCalledTimes(1);
                expect(this.spreadsheet.fields.length).toEqual(2);
            });
        });

    });
